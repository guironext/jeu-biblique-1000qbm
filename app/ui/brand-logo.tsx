"use client";

import { useEffect, useRef } from "react";

export function BrandLogo({
  compact = false,
  size,
  tone = "light",
}: {
  compact?: boolean;
  size?: "hero" | "compact" | "header";
  tone?: "light" | "dark";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resolvedSize = size ?? (compact ? "compact" : "hero");
  const isHeader = resolvedSize === "header";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.volume = 0;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (motionQuery.matches) {
        video.pause();
        video.currentTime = 0;
        return;
      }

      const playback = video.play();
      if (playback) {
        playback.catch(() => {
          // Autoplay can be denied until a user gesture; keep the first frame.
        });
      }
    };

    syncPlayback();
    video.addEventListener("canplay", syncPlayback);
    motionQuery.addEventListener("change", syncPlayback);
    return () => {
      video.removeEventListener("canplay", syncPlayback);
      motionQuery.removeEventListener("change", syncPlayback);
    };
  }, []);

  const video = (
    <video
      ref={videoRef}
      src="/logovideo.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden
      className={
        isHeader
          ? "h-full w-full object-cover"
          : "aspect-video h-auto w-full object-cover"
      }
    >
      Logo 1000 QBM
    </video>
  );

  if (isHeader) {
    return (
      <div
        className={`relative h-9 w-[4.05rem] overflow-hidden rounded-lg bg-stone-900 shadow-sm sm:h-10 sm:w-[4.6rem] sm:rounded-[0.7rem] ${
          tone === "dark"
            ? "ring-1 ring-white/18"
            : "ring-1 ring-olive-200/90"
        }`}
      >
        {video}
      </div>
    );
  }

  return (
    <div
      className={
        resolvedSize === "compact"
          ? "relative mx-auto w-full max-w-[16.5rem] sm:max-w-[19rem] lg:mx-0 lg:max-w-lg"
          : "relative mx-auto w-full max-w-[22rem] sm:max-w-md lg:mx-0 lg:max-w-none"
      }
    >
      <div
        aria-hidden
        className="absolute inset-x-4 inset-y-3 rounded-[2rem] bg-olive-200/55 blur-3xl"
      />
      <div
        className={`relative overflow-hidden border border-olive-200/80 bg-stone-800 shadow-[0_24px_60px_-28px_rgba(28,25,23,0.55)] ${
          resolvedSize === "compact"
            ? "rounded-2xl sm:rounded-[1.35rem]"
            : "rounded-2xl sm:rounded-3xl"
        }`}
      >
        {video}
      </div>
    </div>
  );
}
