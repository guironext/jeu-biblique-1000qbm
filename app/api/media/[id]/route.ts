import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { catalogImages } from "@/lib/db/schema";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await db.query.catalogImages.findFirst({
    where: eq(catalogImages.id, id),
    columns: { contentType: true, data: true },
  });

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
