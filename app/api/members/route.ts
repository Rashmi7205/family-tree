import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  await dbConnect();

  if (!name.trim()) {
    return NextResponse.json([]);
  }

  // Case-insensitive partial match on firstName or lastName
  const members = await Member.find({
    $or: [
      { firstName: { $regex: name, $options: "i" } },
      { lastName: { $regex: name, $options: "i" } },
    ],
  })
    .limit(20)
    .lean();

  return NextResponse.json(
    members.map((m: any) => ({
      id: m._id.toString(),
      name: `${m.firstName} ${m.lastName}`.trim(),
      photoUrl: m.profileImageUrl || null,
      familyid: m.familyTreeId,
      gender: m.gender,
      birthDate: m.birthDate || null,
    }))
  );
}
