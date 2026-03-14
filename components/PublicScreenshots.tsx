"use client";

import { useMemo, useRef, useState } from "react";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { PhoneFrame, NotchType } from "@/components/PhoneFrame";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FramedPreviewModal } from "@/components/FramedPreviewModal";

type PublicScreenshotsProps = {
  appName?: string;
  imageUrls: string[];
  isPremium: boolean;
  platforms?: string[];
};

export default function PublicScreenshots({
  appName = "App",
  imageUrls,
  isPremium,
  platforms = [],
}: PublicScreenshotsProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const images = useMemo(() => imageUrls.filter(Boolean), [imageUrls]);

  const isIOS = useMemo(
    () =>
      platforms.some((p) => {
        const v = String(p).toUpperCase();
        return v === "IOS" || v === "APPLE";
      }),
    [platforms]
  );

  const notch: NotchType = isIOS ? "iphone-pill" : "android-center-hole";

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  if (!images.length) return null;

  return (
    <>
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8fbff] to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f8fbff] to-transparent" />

        {/* Left button */}
        <button
          type="button"
          onClick={() => scrollByAmount(-420)}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition hover:bg-white cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right button */}
        <button
          type="button"
          onClick={() => scrollByAmount(420)}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition hover:bg-white cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Single row carousel */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth px-14 py-4 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {images.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => openAt(idx)}
              className="group shrink-0 text-center cursor-pointer"
            >
              <div className="mx-auto w-[220px] sm:w-[240px] lg:w-[260px]">
                <PhoneFrame
                  src={url}
                  alt={`${appName} screenshot ${idx + 1}`}
                  fit="cover"
                  notch={notch}
                  aspect="9/19.5"
                  variant="gallery"
                  className="transition duration-200 group-hover:-translate-y-1"
                />
              </div>

              <div className="mt-4 text-base font-medium text-slate-600">
                Screen {idx + 1}
              </div>
            </button>
          ))}
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <FramedPreviewModal
        open={open}
        images={images}
        startIndex={startIndex}
        onClose={() => setOpen(false)}
        allowCrop={false}
        allowNotchChange={true}
        initialNotch={notch}
        title="App Screens"
      />
    </>
  );
}