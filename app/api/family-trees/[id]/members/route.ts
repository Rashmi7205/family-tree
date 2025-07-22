import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import FamilyTree from "@/models/FamilyTree";
import Member from "@/models/Member";
import { logAudit } from "@/lib/audit";
import {
  getTokenFromRequest,
  verifyFirebaseToken,
} from "../../../../../lib/auth/verify-token";
import User from "../../../../../models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const createMemberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  birthDate: z.string().nullable().optional(),
  deathDate: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  parents: z.array(z.string()).optional(),
  children: z.array(z.string()).optional(),
  spouseId: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findOne({ uid: decodedToken.user_id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use public/uploads directory to handle file upload


    const formData = await request.formData();
    const file = formData.get("profileImage");
    if (file && typeof file !== "string") {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
    let profileImageUrl: string | undefined = formData.get(
      "profileImageUrl"
    ) as string | undefined;

    if (file && typeof file !== "string") {
      const ext = path.extname(file.name).toLowerCase();
      const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { error: "Only png, jpg, jpeg, webp, and svg files are allowed" },
          { status: 400 }
        );
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "");
      const now = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const filename = `${uuidv4()}_${now}_${safeName}`;
      const filePath = path.join("public", "uploads", filename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      profileImageUrl = `/uploads/${filename}`;
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const birthDate = formData.get("birthDate") as string | null;
    const deathDate = formData.get("deathDate") as string | null;
    const gender = formData.get("gender") as string;
    const bio = formData.get("bio") as string | null;
    let spouseId = formData.get("spouseId") as string | null;
    // Sanitize spouseId input
    if (spouseId === "null" || spouseId === "") {
      spouseId = null;
    }

    // Handle parents and children from FormData.
    const parents = (formData.getAll("parents") as string[]).filter(Boolean);
    const children = (formData.getAll("children") as string[]).filter(Boolean);

    // --- Relationship Validations ---

    // A member cannot be both a parent and a child of another member.
    if (parents.some((p) => children.includes(p))) {
      return NextResponse.json(
        { error: "A member cannot be both a parent and a child." },
        { status: 400 }
      );
    }
    if (spouseId) {
      // A spouse cannot be a direct parent or child.
      if (parents.includes(spouseId) || children.includes(spouseId)) {
        return NextResponse.json(
          { error: "A spouse cannot be a direct parent or child." },
          { status: 400 }
        );
      }

      // A spouse cannot be a sibling (share a parent).
      const spouseMember = await Member.findById(spouseId);
      if (
        spouseMember &&
        spouseMember.parents &&
        spouseMember.parents.length > 0 &&
        parents.length > 0
      ) {
        const sharedParents = parents.filter((p) =>
          spouseMember.parents.map(String).includes(p)
        );
        if (sharedParents.length > 0) {
          return NextResponse.json(
            { error: "Cannot set a sibling as a spouse." },
            { status: 400 }
          );
        }
      }
    }

    // Validate required fields
    const data = createMemberSchema.parse({
      firstName,
      lastName,
      gender,
      birthDate: birthDate || null,
      deathDate: deathDate || null,
      bio: bio || null,
      parents,
      children,
      spouseId,
    });

    // Verify user owns the family tree
    const tree = await FamilyTree.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!tree) {
      return NextResponse.json(
        { error: "Family tree not found" },
        { status: 404 }
      );
    }

    const memberData = {
      ...data,
      familyTreeId: params.id,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      deathDate: data.deathDate ? new Date(data.deathDate) : undefined,
      profileImageUrl,
      parents: data.parents || [],
      children: data.children || [],
      spouseId: spouseId || null,
    };

    const member = await Member.create(memberData);

    // --- Bi-directional relationship updates ---

    // If spouseId is provided, update the spouse's spouseId to this member
    if (data.spouseId) {
      await Member.findByIdAndUpdate(data.spouseId, { spouseId: member._id });
    }

    // Update each parent to include this new member as a child
    if (data.parents && data.parents.length > 0) {
      await Member.updateMany(
        { _id: { $in: data.parents } },
        { $addToSet: { children: member._id } }
      );
    }

    // Update each child to include this new member as a parent
    if (data.children && data.children.length > 0) {
      await Member.updateMany(
        { _id: { $in: data.children } },
        { $addToSet: { parents: member._id } }
      );
    }

    await logAudit(user.id, "MEMBER_CREATED", "MEMBER", member._id.toString());

    return NextResponse.json({
      ...member.toObject(),
      id: member._id.toString(),
    });
  } catch (error) {
    console.error("Create member error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findOne({ uid: decodedToken.user_id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user owns the family tree
    const tree = await FamilyTree.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!tree) {
      return NextResponse.json(
        { error: "Family tree not found" },
        { status: 404 }
      );
    }

    // Fetch all members for this family tree
    const members = await Member.find({ familyTreeId: params.id });

    return NextResponse.json(
      members.map((member) => ({
        ...member.toObject(),
        id: member._id.toString(),
      }))
    );
  } catch (error) {
    console.error("Fetch members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
