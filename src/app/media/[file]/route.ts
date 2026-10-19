import { readUpload } from "@/lib/uploads";

/** Menyajikan foto yang diunggah lewat admin dari folder UPLOAD_DIR. */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const data = await readUpload(file);
  if (!data) return new Response("Not found", { status: 404 });

  // Nama file berupa UUID dan tidak pernah ditimpa, jadi aman di-cache selamanya.
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
