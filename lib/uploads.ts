import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { catalogImages } from "@/lib/db/schema";

const MAX_BYTES = 4 * 1024 * 1024;
const MEDIA_PREFIX = "/api/media/";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export type ImageUploadResult =
  | { url: string }
  | { error: string };

function resolveImageType(file: File) {
  const mimeExtension: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/pjpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const fromMime = mimeExtension[file.type];
  if (fromMime) {
    return { contentType: CONTENT_TYPES[fromMime] };
  }

  const name = file.name.toLowerCase();
  const match = name.match(/\.([a-z0-9]+)$/);
  const fromName = match?.[1] === "jpeg" ? "jpg" : match?.[1];
  if (fromName && CONTENT_TYPES[fromName]) {
    return { contentType: CONTENT_TYPES[fromName] };
  }

  return null;
}

function mediaIdFromUrl(url: string | null | undefined) {
  if (!url?.startsWith(MEDIA_PREFIX)) {
    return null;
  }

  const id = url.slice(MEDIA_PREFIX.length).split("?")[0];
  return UUID_PATTERN.test(id) ? id : null;
}

export async function saveUploadedImage(
  file: File,
  folder: "stages" | "sections",
): Promise<ImageUploadResult> {
  const type = resolveImageType(file);
  if (!type) {
    return { error: "Formats acceptés : JPG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "L'image ne doit pas dépasser 4 Mo." };
  }

  const id = randomUUID();

  try {
    await db.insert(catalogImages).values({
      id,
      folder,
      contentType: type.contentType,
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
    });
  } catch {
    return {
      error:
        "Impossible d'enregistrer l'image en ligne. Réessayez avec un fichier plus léger.",
    };
  }

  return { url: `${MEDIA_PREFIX}${id}` };
}

export async function removeUploadedImage(url: string | null | undefined) {
  const mediaId = mediaIdFromUrl(url);
  if (mediaId) {
    await db.delete(catalogImages).where(eq(catalogImages.id, mediaId));
    return;
  }

  if (!url?.startsWith("/uploads/")) {
    return;
  }

  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  const fullPath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
  if (!fullPath.startsWith(uploadsRoot)) {
    return;
  }

  try {
    await unlink(fullPath);
  } catch {
    // The file may already be gone.
  }
}

export async function resolveImageUpload(
  formData: FormData,
  folder: "stages" | "sections",
  currentUrl?: string | null,
): Promise<{ url: string | null } | { error: string }> {
  const existing =
    String(formData.get("currentImageUrl") ?? "").trim() || currentUrl || null;
  const remove =
    formData.get("removeImage") === "on" || formData.get("removeImage") === "true";
  const file = formData.get("image");

  if (file instanceof File && file.size > 0) {
    const saved = await saveUploadedImage(file, folder);
    if ("error" in saved) {
      return saved;
    }
    await removeUploadedImage(existing);
    return { url: saved.url };
  }

  if (remove) {
    await removeUploadedImage(existing);
    return { url: null };
  }

  return { url: existing };
}
