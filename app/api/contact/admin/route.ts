import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication/authorization here
    // For now, this is a basic implementation

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status !== "all") {
      query.status = status;
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    // Get total count
    const total = await Contact.countDocuments(query);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin contact fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // TODO: Add proper authentication/authorization here

    await connectToDatabase();

    const body = await request.json();
    const { contactId, status } = body;

    if (!contactId || !status) {
      return NextResponse.json(
        { error: "Contact ID and status are required" },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Admin contact update error:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}
