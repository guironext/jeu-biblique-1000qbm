"use client";

import { useEffect, useState } from "react";

export function ImagePicker({
  currentUrl,
  error,
  label = "Image",
}: {
  currentUrl?: string | null;
  error?: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        {label}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full text-sm text-stone-600 file:mr-3 file:inline-flex file:h-10 file:rounded-lg file:border-0 file:bg-stone-900 file:px-3 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-800"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            if (!file) {
              setObjectUrl(null);
              setPreview(currentUrl ?? null);
              return;
            }
            const nextUrl = URL.createObjectURL(file);
            setObjectUrl(nextUrl);
            setPreview(nextUrl);
          }}
        />
        <span className="font-normal text-stone-500">
          JPG, PNG, WEBP ou GIF · 4 Mo maximum
        </span>
      </label>
      {currentUrl ? (
        <input type="hidden" name="currentImageUrl" value={currentUrl} />
      ) : null}
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="h-40 w-full object-cover sm:h-44"
          />
        </div>
      ) : (
        <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500">
          Aucune image sélectionnée
        </div>
      )}
      {currentUrl ? (
        <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
          <input name="removeImage" type="checkbox" />
          Retirer l&apos;image actuelle
        </label>
      ) : null}
      {error ? <p className="text-sm font-normal text-red-700">{error}</p> : null}
    </div>
  );
}

export function CoverThumb({
  src,
  alt,
  size = "sm",
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md";
}) {
  const className =
    size === "md"
      ? "size-16 rounded-xl sm:size-[4.5rem]"
      : "size-12 rounded-lg sm:size-14";

  if (!src) {
    return (
      <div
        aria-hidden
        className={`${className} shrink-0 bg-stone-100 ring-1 ring-stone-200`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${className} shrink-0 object-cover ring-1 ring-stone-200`}
    />
  );
}
