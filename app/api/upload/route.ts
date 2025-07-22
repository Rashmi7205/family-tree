import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No file uploaded. Request does not contain a file." },
        { status: 400 }
      );
    }
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
    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    const publicPath = `/uploads/${filename}`;
    return NextResponse.json({ path: publicPath }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePathParam = searchParams.get("path");
  if (!filePathParam) {
    return NextResponse.json(
      { error: "No file path provided" },
      { status: 400 }
    );
  }
  const filePath = path.join(process.cwd(), "public", filePathParam);
  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ path: filePathParam, deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: "File not found or could not be deleted" },
      { status: 404 }
    );
  }
}
