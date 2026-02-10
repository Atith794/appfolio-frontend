"use client";

import Cropper from "react-easy-crop";
import { useEffect, useMemo, useState } from "react";
import { Minus, MoveLeft, MoveRight, Plus, Save } from "lucide-react";

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
  showSave?:boolean;
  viewerOnly?: boolean;
  viewerFit?:"contain" | "cover";
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  // When modal opens or startIndex changes, sync the index
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const imageUrl = images[index] || "";
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  const canSave = useMemo(
    () => !!croppedAreaPixels && !!imageUrl, 
    [croppedAreaPixels, imageUrl]
  );

  // Keyboard navigation
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

  // Reset crop UI when changing image
  useEffect(() => {
    setZoom(1);
    if (!viewerOnly) {
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  }, [index, viewerOnly]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 95vw)",
          height: "min(720px, 97vh)",
          background: "#111",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "1fr auto"
        }}
      >
        {/* Viewer + cropper */}
        <div style={{ position: "relative" }}>
          {/* Prev/Next buttons */}
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => canPrev && setIndex((i) => i - 1)}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid #333",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              cursor: canPrev ? "pointer" : "not-allowed",
              opacity: canPrev ? 1 : 0.4,
              zIndex: 10
            }}
            aria-label="Previous"
            title="Previous (←)"
          >
            <MoveLeft />
          </button>

          <button
            type="button"
            disabled={!canNext}
            onClick={() => canNext && setIndex((i) => i + 1)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid #333",
              background: "rgba(0,0,0,0.45)",
              color: "#fff",
              cursor: canNext ? "pointer" : "not-allowed",
              opacity: canNext ? 1 : 0.4,
              zIndex: 10
            }}
            aria-label="Next"
            title="Next (→)"
          >
            <MoveRight />
          </button>

          <div style={{ position: "absolute", left: 12, bottom: 12, color: "#bbb", fontSize: 12, zIndex: 10 }}>
            {images.length ? `${index + 1} / ${images.length}` : ""}
          </div>

          {viewerOnly ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "auto",
                display: "grid",
                placeItems: "center",
                padding:"16"
              }}
            >
               <div
                style={{
                  width: "min(420px, 92vw)",    
                  aspectRatio: String(aspect),  
                  overflow: "hidden",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "#000",
                  position: "relative",
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
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
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels as any)}
            />
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: 12, background: "#0b0b0b", display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #333", color: "#fff", background: "transparent" }}
          >
            <Minus />
          </button>

          <div style={{ color: "#ddd", fontSize: 12, minWidth: 70, textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </div>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, Number((z + 0.2).toFixed(2))))}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #333", color: "#fff", background: "transparent" }}
          >
            <Plus />
          </button>

          <button
            type="button"
            onClick={() => {
              setZoom(1);
              if (!viewerOnly) setCrop({ x: 0, y: 0 });
            }}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #333", color: "#fff", background: "transparent" }}
          >
            Reset
          </button>

          <div style={{ flex: 1 }} />

           <button
            type="button"
            onClick={onClose}
            className="bg-primary/40 font-serif hover:bg-primary/20"
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #333", color: "#fff", }}
          >
            Close
          </button>

          {showSave && !viewerOnly ? 
          <button
            type="button"
            disabled={!canSave}
            onClick={async () => {
              if (!croppedAreaPixels) return;
              await onSaveCrop(index, croppedAreaPixels, zoom);
            }}
            className=" hover:text-primary bg-white font-serif"
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #fff",
              color: "#111",
              opacity: canSave ? 1 : 0.5,
              cursor: canSave ? "pointer" : "not-allowed"
            }}
          >
            Save crop
          </button>:null}
        </div>
      </div>
    </div>
  );
}