"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Crop } from "lucide-react";
import { PhoneFrame, NotchType } from "./PhoneFrame";
import { ImageViewerModal } from "@/components/ImageViewerModal";

type CropPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  open: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;

  onSaveCrop?: (
    index: number,
    cropPixels: CropPixels,
    zoom: number
  ) => Promise<void>;

  // UI controls
  allowCrop?: boolean;
  allowNotchChange?: boolean;
  initialNotch?: NotchType;
  title?: string;
};

export function FramedPreviewModal({
  open,
  images,
  startIndex,
  onClose,
  onSaveCrop,
  allowCrop = false,
  allowNotchChange = true,
  initialNotch = "iphone-pill",
  title = "Preview",
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [cropOpen, setCropOpen] = useState(false);
  const [notch, setNotch] = useState<NotchType>(initialNotch);

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
    }
  }, [open, startIndex]);

  useEffect(() => {
    setNotch(initialNotch);
  }, [initialNotch]);

  const imageUrl = images[index] || "";
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canPrev) setIndex((i) => i - 1);
      if (e.key === "ArrowRight" && canNext) setIndex((i) => i + 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, canPrev, canNext, onClose]);

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="fixed inset-0 z-[61] grid place-items-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[98vh] rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden flex flex-col"
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm font-semibold text-slate-800">
              {title} ({index + 1}/{images.length})
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-primary"
              aria-label="Close"
              title="Close"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-hidden">
            <div className="flex flex-col items-center gap-6">

              {/* Screenshot viewer */}
              <div className="relative flex items-center justify-center w-full">

                {/* LEFT BUTTON */}
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => canPrev && setIndex((i) => i - 1)}
                  className="absolute m-5 left-5 md:-left-10 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-primary p-3 shadow hover:bg-white hover:text-primaryhover:bg-white hover:text-primary hover:border-2 hover:border-primary cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* SCREENSHOT */}
                <PhoneFrame
                  src={imageUrl}
                  alt={`Screenshot ${index + 1}`}
                  fit="cover"
                  notch={notch}
                  className="w-50 sm:w-64 md:w-61"
                />

                {/* RIGHT BUTTON */}
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => canNext && setIndex((i) => i + 1)}
                  className="absolute m-5 right-0 md:-right-10 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-primary p-3 shadow hover:bg-white hover:text-primary cursor-pointer hover:border-2 hover:border-primary disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

              {/* NOTCH SELECTOR */}
              {allowNotchChange ? (
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {([
                    ["iphone-pill", "Pill"],
                    ["iphone-notch", "Notch"],
                    ["android-hole", "Hole R"],
                    ["android-center-hole", "Hole C"],
                    ["android-teardrop", "Drop"],
                    ["none", "None"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNotch(value)}
                      className={`px-3 py-1.5 rounded-lg text-s border transition text-primary hover:bg-primary/20 font-mono cursor-pointer ${
                        notch === value
                          ? "bg-primary/10 border-primary/30"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* CROP BUTTON */}
              {allowCrop && onSaveCrop ? (
                <button
                  type="button"
                  onClick={() => setCropOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary border-2 font-serif"
                >
                  <Crop size={16} />
                  Crop to phone
                </button>
              ) : null}

            </div>
          </div>
        </div>
      </div>

      {allowCrop && onSaveCrop ? (
        <ImageViewerModal
          open={cropOpen}
          images={images}
          startIndex={index}
          aspect={9 / 19.5}
          onClose={() => setCropOpen(false)}
          onSaveCrop={async (i, cropPixels, zoom) => {
            await onSaveCrop(i, cropPixels, zoom);
            setCropOpen(false);
          }}
        />
      ) : null}
    </>
  );
}