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
};

function Notch({ type }: { type: NotchType }) {
  if (type === "none") return null;

  // All notch elements sit above the image, inside the inner bezel container.
  switch (type) {
    case "iphone-pill":
      return (
        <div
          className="
            absolute left-1/2 top-2.5 z-10 -translate-x-1/2
            h-4.5 w-23
            rounded-full
            bg-black/90
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
            h-7 w-37.5
            rounded-b-[18px]
            bg-black/90
            ring-1 ring-white/10
            shadow-[0_6px_14px_rgba(0,0,0,0.35)]
          "
        />
      );

    case "android-hole":
      return (
        <div
          className="
            absolute right-4.5 top-3.5 z-10
            h-3 w-3
            rounded-full
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
            h-3 w-3
            rounded-full
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
              relative h-5.5 w-11.5
              bg-black/90
              rounded-b-[18px]
              ring-1 ring-white/10
              shadow-[0_6px_14px_rgba(0,0,0,0.35)]
            "
          />
          {/* small camera dot */}
          <div
            className="
              absolute left-1/2 top-2.5 -translate-x-1/2
              h-1.5 w-1.5
              rounded-full bg-black
              ring-1 ring-white/10
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
}: PhoneFrameProps) {
  return (
    <div className={`w-full ${className}`}>
      <div
        className="
          relative mx-auto
          w-full
          rounded-[2.4rem]
          bg-slate-950
          shadow-[0_18px_50px_rgba(0,0,0,0.25)]
          ring-1 ring-white/10
          p-2.5
        "
        style={{ aspectRatio: aspect }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-4xl bg-black">
          <Notch type={notch} />

          <img
            src={src ? src:undefined}
            alt={alt}
            className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain bg-black"}`}
            loading="lazy"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-black/10" />
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] ring-1 ring-white/5" />
      </div>
    </div>
  );
}