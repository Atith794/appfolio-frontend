"use client";

import { useState } from "react";
import { ImageViewerModal } from "@/components/ImageViewerModal";

type ClickToViewImageProps = {
  src: string;
  alt?: string;
  className?: string;

  /** Viewer crop aspect (not used for saving, but Cropper still needs an aspect) */
  viewerAspect?: number;
};

export default function ClickToViewImage({
  src,
  alt = "Image",
  className = "",
  viewerAspect = 16 / 9,
}: ClickToViewImageProps) {
  const [open, setOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block ${className}`}
        title="Click to view"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full"
          loading="lazy"
          draggable={false}
        />
      </button>
      <ImageViewerModal
        open={open}
        images={[src]}
        startIndex={0}
        onClose={() => setOpen(false)}
        onSaveCrop={() => {}}
        showSave={false}
        viewerOnly={true}
      />
    </>
  );
}
