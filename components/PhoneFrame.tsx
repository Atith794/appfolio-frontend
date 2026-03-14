import React from "react";

export type NotchType =
  | "none"
  | "iphone-pill"
  | "iphone-notch"
  | "android-hole"
  | "android-center-hole"
  | "android-teardrop";

type PhoneFrameProps = {
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  notch?: NotchType;
  className?: string;
  aspect?: string;
  variant?: "hero" | "gallery";
};

function Notch({ type }: { type: NotchType }) {
  if (type === "none") return null;

  switch (type) {
    case "iphone-pill":
      return (
        <div
          className="
            absolute left-1/2 top-2.5 z-10 -translate-x-1/2
            h-[18px] w-[92px]
            rounded-full
            bg-black/95
            ring-1 ring-white/10
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
          "
        />
      );

    case "iphone-notch":
      return (
        <div
          className="
            absolute left-1/2 top-0 z-10 -translate-x-1/2
            h-[28px] w-[150px]
            rounded-b-[18px]
            bg-black/95
            ring-1 ring-white/10
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
          "
        />
      );

    case "android-hole":
      return (
        <div
          className="
            absolute right-4 top-3.5 z-10
            h-3 w-3 rounded-full
            bg-black/95
            ring-1 ring-white/10
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
          "
        />
      );

    case "android-center-hole":
      return (
        <div
          className="
            absolute left-1/2 top-3.5 z-10 -translate-x-1/2
            h-3 w-3 rounded-full
            bg-black/95
            ring-1 ring-white/10
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
          "
        />
      );

    case "android-teardrop":
      return (
        <div className="absolute left-1/2 top-1.5 z-10 -translate-x-1/2">
          <div
            className="
              relative h-[22px] w-[46px]
              rounded-b-[18px]
              bg-black/95
              ring-1 ring-white/10
              shadow-[0_6px_14px_rgba(0,0,0,0.35)]
            "
          />
          <div
            className="
              absolute left-1/2 top-2.5 -translate-x-1/2
              h-1.5 w-1.5 rounded-full bg-black ring-1 ring-white/10
            "
          />
        </div>
      );

    default:
      return null;
  }
}

export function PhoneFrame({
  src,
  alt = "App screenshot",
  fit = "cover",
  notch = "iphone-pill",
  className = "",
  aspect = "9/19.5",
  variant = "gallery",
}: PhoneFrameProps) {
  const isHero = variant === "hero";

  return (
    <div className={`w-full ${className}`}>
      <div
        className={[
          "relative mx-auto w-full overflow-hidden",
          isHero
            ? "rounded-[2.7rem] bg-[#111827] p-[10px] shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
            : "rounded-[2.35rem] bg-[#111827] p-[8px] shadow-[0_18px_40px_rgba(15,23,42,0.16)]",
        ].join(" ")}
        style={{ aspectRatio: aspect }}
      >
        {/* metallic edge */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10" />

        {/* side sheen */}
        <div className="pointer-events-none absolute inset-y-[6%] left-[3px] w-[2px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute inset-y-[8%] right-[3px] w-[2px] rounded-full bg-black/30" />

        <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-black">
          <Notch type={notch} />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src || undefined}
            alt={alt}
            className={`h-full w-full ${
              fit === "cover" ? "object-cover" : "object-contain bg-black"
            }`}
            loading="lazy"
            draggable={false}
          />

          {/* soft glass highlight */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.02)_18%,rgba(0,0,0,0.06)_100%)]" />
        </div>
      </div>
    </div>
  );
}