"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Crop } from "lucide-react";
import { PhoneFrame, NotchType } from "./PhoneFrame";
import { ImageViewerModal } from "@/components/ImageViewerModal";

type Props = {
  open: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
  onSaveCrop: (index: number, cropPixels: { x: number; y: number; width: number; height: number }, zoom: number) => Promise<void>;
};

export function FramedPreviewModal({
  open,
  images,
  startIndex,
  onClose,
  onSaveCrop,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [cropOpen, setCropOpen] = useState(false);
  const [notch, setNotch] = useState<NotchType>("iphone-pill");
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const imageUrl = images[index] || "";
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  // keyboard nav
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
          // className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden"
          className="w-full max-w-3xl max-h-[98vh] rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden flex flex-col"
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm font-semibold text-slate-800">
              Preview ({index + 1}/{images.length})
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-primary "
              aria-label="Close"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* body */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            <div className="flex flex-col items-center gap-5">
              <PhoneFrame
                src={imageUrl}
                alt={`Screenshot ${index + 1}`}
                fit="cover"
                notch={notch}
                className="w-50 sm:w-55 md:w-60"
              />

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => canPrev && setIndex((i) => i - 1)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-slate-50 hover:text-primary bg-primary font-serif"
                >
                  <ChevronLeft size={16} />
                  Left
                </button>

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => canNext && setIndex((i) => i + 1)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm disabled:opacity-50 hover:bg-slate-50 hover:text-primary bg-primary font-serif "
                >
                  Right
                  <ChevronRight size={16} />
                </button>
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
                        className={`px-3 py-1.5 rounded-lg text-xs border transition hover:bg-primary/20 text-primary
                            ${notch === value ? "bg-primary/10 text-primary border-primary/30" : "hover:bg-slate-50"}
                        `}
                        >
                        {label}
                        </button>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCropOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 text-bold border-primary border-2 font-serif"
                >
                  <Crop size={16} />
                  Crop to phone
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cropper modal (reusing your existing one) */}
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
    </>
  );
}
