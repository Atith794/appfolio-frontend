// "use client";

// import { useMemo, useState } from "react";
// import { ImageViewerModal } from "@/components/ImageViewerModal";
// import { PhoneFrame, NotchType } from "@/components/PhoneFrame";

// type PublicScreenshotsProps = {
//   appName?: string;
//   imageUrls: string[];
//   isPremium: boolean;
//   platforms?: string[];
//   aspect?: string;      // phone frame aspect (premium)
//   viewerAspect?: number; // modal crop/view aspect
// };

// export default function PublicScreenshots({
//   appName = "App",
//   imageUrls,
//   isPremium,
//   platforms = [],
//   aspect = "9/19.5",
//   viewerAspect = 9 / 19.5,
// }: PublicScreenshotsProps) {
//   const [open, setOpen] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);

//   const images = useMemo(() => imageUrls.filter(Boolean), [imageUrls]);

//   const isIOS = useMemo(
//     () => platforms.some((p) => String(p).toUpperCase() === "IOS" || String(p).toUpperCase() === "APPLE"),
//     [platforms]
//   );

//   const notch: NotchType = isIOS ? "iphone-pill" : "android-center-hole";

//   const openAt = (idx: number) => {
//     setStartIndex(idx);
//     setOpen(true);
//   };

//   if (!images.length) return null;

//   return (
//     <>
//       {/* Side-by-side strip */}
//       <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
//         {images.map((url, idx) => (
//           <button
//             key={`${url}-${idx}`}
//             type="button"
//             onClick={() => openAt(idx)}
//             className="snap-start flex-none w-55 sm:w-65 lg:w-70 text-left"
//             title="Click to view"
//           >
//             {isPremium ? (
//               <PhoneFrame
//                 src={url}
//                 alt={`${appName} screenshot ${idx + 1}`}
//                 fit="cover"
//                 notch={notch}
//                 aspect={aspect}
//                 className="cursor-pointer"
//               />
//             ) : (
//               // Non-premium: plain screenshot, still consistent height
//               <div
//                 className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
//                 style={{ aspectRatio: "9/19.5" }}
//               >
//                 <img
//                   src={url}
//                   alt={`${appName} screenshot ${idx + 1}`}
//                   className="h-full w-full object-cover"
//                   loading="lazy"
//                   draggable={false}
//                 />
//               </div>
//             )}
//           </button>
//         ))}
//       </div>

//         {/* Modal viewer */}
//         <ImageViewerModal
//             open={open}
//             images={images}
//             startIndex={startIndex}
//             onClose={() => setOpen(false)}
//             aspect={viewerAspect}
//             onSaveCrop={() => {}}
//             showSave={false}
//             viewerOnly={true}  
//             viewerFit = "cover"
//         />
//     </>
//   );
// }

// V2
"use client";

import { useMemo, useState } from "react";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { PhoneFrame, NotchType } from "@/components/PhoneFrame";

type PublicScreenshotsProps = {
  appName?: string;
  imageUrls: string[];
  isPremium: boolean;
  platforms?: string[];
  aspect?: string;
  viewerAspect?: number;
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
  const visibleImages = isPremium ? images : images.slice(0, 6);
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

  if (!images.length) return null;

  return (
    <>
      <div className="relative">
        {/* subtle edge fades to hint scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-white/90 to-transparent rounded-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white/90 to-transparent rounded-3xl" />

        {/* strip */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
          {visibleImages.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => openAt(idx)}
              className="group snap-start flex-none w-[220px] sm:w-[260px] lg:w-[280px] text-left"
              title="Click to view"
            >
              <div className="relative">
                {/* index chip */}
                {/* <div className="absolute left-3 top-3 z-10 rounded-full border border-slate-900/10 bg-white/85 px-2 py-1 text-[11px] font-mono text-slate-700 shadow-sm">
                  {idx + 1}
                </div> */}

                {/* hover hint */}
                {/* <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  View
                </div> */}

                {isPremium ? (
                  <PhoneFrame
                    src={url}
                    alt={`${appName} screenshot ${idx + 1}`}
                    fit="cover"
                    notch={notch}
                    aspect={aspect}
                    className="cursor-pointer transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div
                    className="w-full overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.01]"
                    style={{ aspectRatio: "9/19.5" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${appName} screenshot ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* small caption */}
              <div className="mt-2 text-xs font-semibold text-slate-600 font-serif">
                Screen {idx + 1}
              </div>
            </button>
          ))}
        </div>

        {/* small helper line (subtle) */}
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500">
          <span className="font-medium">Scroll to explore</span>
          <span className="font-mono">{images.length} screens</span>
        </div>
      </div>

      <ImageViewerModal
        open={open}
        images={images}
        startIndex={startIndex}
        onClose={() => setOpen(false)}
        aspect={viewerAspect}
        onSaveCrop={() => {}}
        showSave={false}
        viewerOnly={true}
        viewerFit="cover"
      />
    </>
  );
}
