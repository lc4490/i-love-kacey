// app/api/gallery/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    const files = fs
      .readdirSync(dir)
      .filter(
        (f) =>
          /\.(png|jpe?g|heic|webp|gif|avif)$/i.test(f) && !f.startsWith(".")
      )
      .map((f) => `/gallery/${encodeURIComponent(f)}`);
    return NextResponse.json({ images: files });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
