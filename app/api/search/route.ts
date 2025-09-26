import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchEmbedding } from "@/lib/httpClient";

export async function POST(req: Request) {
  const { query } = await req.json();
  const { embedding } = await fetchEmbedding(query);

  // Vector search (unsafe interpolation — sanitize in real usage)
  const sql = `
    SELECT id, url, description
    FROM "Image"
    ORDER BY embedding <-> '[${embedding.join(",")}]'
    LIMIT 1
  `;

  const result = await db.$queryRawUnsafe(sql);
  return NextResponse.json(result);
}
