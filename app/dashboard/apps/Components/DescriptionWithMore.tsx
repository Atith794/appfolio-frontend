// import { useState } from "react";
// import { FileText, Info } from "lucide-react";

// const DESC_LIMIT = 2;

// export function DescriptionWithMore({ text }: { text: string }) {
//   const [open, setOpen] = useState(false);
//   const isLong = text.length > DESC_LIMIT;

//   return (
//     <div className="relative">
//       <div className="flex items-start gap-2 text-sm text-slate-600 font-serif">
//         <FileText className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />

//         <span className="leading-relaxed">
//           <span className="line-clamp-2">{text}</span>

//           {isLong && (
//             <button
//               type="button"
//               className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline
//                          focus:outline-none focus:ring-2 focus:ring-primary/30 rounded"
//               onMouseEnter={() => setOpen(true)}
//               onMouseLeave={() => setOpen(false)}
//               onFocus={() => setOpen(true)}
//               onBlur={() => setOpen(false)}
//               aria-label="View full description"
//             >
//               <Info className="w-3.5 h-3.5" /> See Full Description
//             </button>
//           )}
//         </span>
//       </div>

//       {open && isLong && (
//         <div
//           className="absolute left-6 top-full mt-2 w-[420px] max-w-[80vw]
//                      rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-lg z-50"
//           role="tooltip"
//         >
//           <div className="font-medium text-slate-900 mb-1">Full description</div>
//           <div className="text-slate-700">{text}</div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileText, X } from "lucide-react";

type Props = {
  text: string;
  limit?: number; // number of characters before truncation
  title?: string;
};

export function DescriptionWithMore({
  text,
  limit = 80,
  title = "Full description",
}: Props) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isLong = text.length > limit;
  const preview = isLong ? text.slice(0, limit).trimEnd() + "..." : text;

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-start gap-2 text-sm text-slate-600 font-serif">
        <FileText className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />

        <span className="leading-relaxed">
          {preview}{" "}
          {isLong && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-xs text-primary hover:underline font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/30 rounded cursor-pointer"
              aria-expanded={open}
              aria-controls={popoverId}
            >
              {open ? "Hide" : "Read More"}
            </button>
          )}
        </span>
      </div>

      {open && isLong && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={title}
          className="absolute left-6 top-full mt-2 w-[480px] max-w-[85vw]
                     rounded-xl border border-slate-200 bg-white p-4 shadow-lg z-50"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">{title}</div>
              <div className="mt-2 text-sm text-slate-700 leading-relaxed">
                {text}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700
                         hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}