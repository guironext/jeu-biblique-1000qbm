import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 4 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const uploadsRoot = path.join(process.cwd(), "public", "uploads");

export type ImageUploadResult =
  | { url: string }
  | { error: string };

export async function saveUploadedImage(
  file: File,
  folder: "stages" | "sections",
): Promise<ImageUploadResult> {
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return { error: "Formats acceptés : JPG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "L'image ne doit pas dépasser 4 Mo." };
  }

  const filename = `${randomUUID()}.${extension}`;
  const directory = path.join(uploadsRoot, folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  return { url: `/uploads/${folder}/${filename}` };
}

export async function removeUploadedImage(url: string | null | undefined) {
  if (!url?.startsWith("/uploads/")) {
    return;
  }

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
