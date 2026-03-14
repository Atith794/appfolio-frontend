"use client";

import Cropper from "react-easy-crop";
import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  MoveLeft,
  MoveRight,
  Plus,
  Save,
  X,
  RotateCcw,
} from "lucide-react";

type CropArea = { x: number; y: number; width: number; height: number };

export function ImageViewerModal({
  open,
  images,
  startIndex,
  onClose,
  onSaveCrop,
  aspect = 4 / 5,
  showSave = true,
  viewerOnly = false,
  viewerFit = "contain",
}: {
  open: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
  onSaveCrop: (index: number, cropPixels: CropArea, zoom: number) => Promise<void> | void;
  aspect?: number;
  showSave?: boolean;
  viewerOnly?: boolean;
  viewerFit?: "contain" | "cover";
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const imageUrl = images[index] || "";
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  const canSave = useMemo(
    () => !viewerOnly && !!croppedAreaPixels && !!imageUrl,
    [viewerOnly, croppedAreaPixels, imageUrl]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canPrev) setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight" && canNext) setIndex((i) => Math.min(images.length - 1, i + 1));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, canPrev, canNext, images.length, onClose]);

  useEffect(() => {
    setZoom(1);
    if (!viewerOnly) {
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  }, [index, viewerOnly]);

  if (!open) return null;

  const resetView = () => {
    setZoom(1);
    if (!viewerOnly) {
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[min(92vh,860px)] w-[min(1100px,96vw)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1020] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="text-sm font-medium text-white/80">
            {images.length ? `${index + 1} / ${images.length}` : ""}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewer */}
        <div className="relative flex-1 overflow-hidden">
          {/* Prev */}
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => canPrev && setIndex((i) => i - 1)}
            className={[
              "absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-3 transition",
              canPrev
                ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                : "cursor-not-allowed border-white/5 bg-white/5 text-white/30",
            ].join(" ")}
            aria-label="Previous"
            title="Previous (←)"
          >
            <MoveLeft className="h-4 w-4" />
          </button>

          {/* Next */}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => canNext && setIndex((i) => i + 1)}
            className={[
              "absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-3 transition",
              canNext
                ? "border-white/10 bg-white/10 text-white hover:bg-white/15"
                : "cursor-not-allowed border-white/5 bg-white/5 text-white/30",
            ].join(" ")}
            aria-label="Next"
            title="Next (→)"
          >
            <MoveRight className="h-4 w-4" />
          </button>

          {viewerOnly ? (
            <div className="absolute inset-0 grid place-items-center p-6 sm:p-8">
              <div
                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                style={{
                  height: "min(calc(92vh - 180px), 720px)",
                  aspectRatio: String(aspect),
                  width: "auto",
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                  transition: "transform 180ms ease",
                }}
              >
                <img
                  src={imageUrl}
                  alt=""
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: viewerFit === "cover" ? "cover" : "contain",
                    background: "#000",
                    userSelect: "none",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels as any)}
              />
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-black/20 px-4 py-3 sm:px-5">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="min-w-[64px] text-center text-sm font-medium text-white/80">
              {Math.round(zoom * 100)}%
            </div>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(4, Number((z + 0.2).toFixed(2))))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>

          {showSave && !viewerOnly ? (
            <button
              type="button"
              disabled={!canSave}
              onClick={async () => {
                if (!croppedAreaPixels) return;
                await onSaveCrop(index, croppedAreaPixels, zoom);
              }}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                canSave
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "cursor-not-allowed bg-white/30 text-slate-700",
              ].join(" ")}
            >
              <Save className="h-4 w-4" />
              Save crop
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}