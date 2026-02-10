"use client";

import { useMemo, useState } from "react";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { PhoneFrame, NotchType } from "@/components/PhoneFrame";

type PublicScreenshotsProps = {
  appName?: string;
  imageUrls: string[];
  isPremium: boolean;
  platforms?: string[];
  aspect?: string;      // phone frame aspect (premium)
  viewerAspect?: number; // modal crop/view aspect
};

export default function PublicScreenshots({
  appName = "App",
  imageUrls,
  isPremium,
  platforms = [],
  aspect = "9/19.5",
  viewerAspect = 9 / 19.5,
}: PublicScreenshotsProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const images = useMemo(() => imageUrls.filter(Boolean), [imageUrls]);

  const isIOS = useMemo(
    () => platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE"),
    [platforms]
  );

  const notch: NotchType = isIOS ? "iphone-pill" : "android-center-hole";

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  if (!images.length) return null;

  return (
    <>
      {/* Side-by-side strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {images.map((url, idx) => (
          <button
            key={`${url}-${idx}`}
            type="button"
            onClick={() => openAt(idx)}
            className="snap-start flex-none w-55 sm:w-65 lg:w-70 text-left"
            title="Click to view"
          >
            {isPremium ? (
              <PhoneFrame
                src={url}
                alt={`${appName} screenshot ${idx + 1}`}
                fit="cover"
                notch={notch}
                aspect={aspect}
                className="cursor-pointer"
              />
            ) : (
              // Non-premium: plain screenshot, still consistent height
              <div
                className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
                style={{ aspectRatio: "9/19.5" }}
              >
                <img
                  src={url}
                  alt={`${appName} screenshot ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            )}
          </button>
        ))}
      </div>

        {/* Modal viewer */}
        <ImageViewerModal
            open={open}
            images={images}
            startIndex={startIndex}
            onClose={() => setOpen(false)}
            aspect={viewerAspect}
            onSaveCrop={() => {}}
            showSave={false}
            viewerOnly={true}  
            viewerFit = "cover"
        />
    </>
  );
}
