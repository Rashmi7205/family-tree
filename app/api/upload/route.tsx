import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  // Parse form data
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // @ts-ignore
  const buffer = Buffer.from(await file.arrayBuffer());
  // @ts-ignore
  const filename = file.name;
  const filePath = path.join(uploadDir, filename);
  const publicPath = `/upload/${filename}`;

  await promisify(fs.writeFile)(filePath, buffer);

  return NextResponse.json({ path: publicPath }, { status: 201 });
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
    await promisify(fs.unlink)(filePath);
    return NextResponse.json({ path: filePathParam, deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: "File not found or could not be deleted" },
      { status: 404 }
    );
  }
}
