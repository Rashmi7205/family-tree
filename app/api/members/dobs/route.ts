import { NextResponse } from "next/server";
import {
  getTokenFromRequest,
  verifyFirebaseToken,
} from "@/lib/auth/verify-token";
import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import FamilyTree from "@/models/FamilyTree";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // "YYYY-MM"

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Month parameter is required in YYYY-MM format" },
        { status: 400 }
      );
    }

    await connectDB();

    const [, monthNumber] = month.split("-").map(Number);
    const user = await User.findOne({ uid: decodedToken.user_id });
    // 1. Find user's trees
    const userTrees = await FamilyTree.find({ userId: user.id })
      .select("_id")
      .lean();
    const treeIds = userTrees.map((tree) => (tree._id as any).toString());

    if (treeIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Aggregation pipeline to find members with birthdays in the given month
    const dobEvents = await Member.aggregate([
      {
        $match: {
          familyTreeId: { $in: treeIds },
          birthDate: { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          birthMonth: { $month: "$birthDate" },
        },
      },
      {
        $match: {
          birthMonth: monthNumber,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d", date: "$birthDate" } },
          members: {
            $push: {
              _id: "$_id",
              name: { $concat: ["$firstName", " ", "$lastName"] },
              dob: {
                $dateToString: { format: "%Y-%m-%d", date: "$birthDate" },
              },
              gender: "$gender",
              imageUrl: "$profileImageUrl",
              familyTreeId: "$familyTreeId",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: { $concat: [month, "-", "$_id"] },
          members: "$members",
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return NextResponse.json(dobEvents);
  } catch (error) {
    console.error("Failed to fetch DOB events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
