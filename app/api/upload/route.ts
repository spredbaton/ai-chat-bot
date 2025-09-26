import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchCaptionAndEmbedding } from "@/lib/httpClient";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("image") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, file.name);
  await fs.writeFile(filePath, buffer);

  // Call Python backend
  const { caption, embedding } = await fetchCaptionAndEmbedding(file);

  // Save to DB
  const rec = await db.image.create({
    data: {
      url: `/uploads/${file.name}`,
      description: caption,
      embedding: embedding,
    },
  });

  return NextResponse.json(rec);
}
