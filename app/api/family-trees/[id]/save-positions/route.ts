import { NextRequest, NextResponse } from "next/server";
import FamilyTree from "@/models/FamilyTree";
import {
  getTokenFromRequest,
  verifyFirebaseToken,
} from "@/lib/auth/verify-token";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

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

    const { nodePositions } = await request.json();

    if (!Array.isArray(nodePositions)) {
      return NextResponse.json(
        { error: "nodePositions must be an array" },
        { status: 400 }
      );
    }

    // Validate nodePositions structure
    for (const pos of nodePositions) {
      if (
        !pos.memberId ||
        typeof pos.x !== "number" ||
        typeof pos.y !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid nodePositions format" },
          { status: 400 }
        );
      }
    }

    const familyTree = await FamilyTree.findByIdAndUpdate(
      params.id,
      { nodePositions: nodePositions },
      { new: true, runValidators: true }
    );

    if (!familyTree) {
      return NextResponse.json(
        { error: "Family tree not found" },
        { status: 404 }
      );
    }


    return NextResponse.json({
      message: "Node positions saved successfully",
      nodePositions: familyTree.nodePositions,
    });
  } catch (error: any) {
    console.error("Error saving node positions:", error);
    return NextResponse.json(
      { error: "Failed to save node positions" },
      { status: 500 }
    );
  }
}
