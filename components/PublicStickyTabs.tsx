"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TabItem = { id: string; label: string; isLocked?: boolean };

export default function PublicStickyTabs({
  items,
  offsetTop = 112, // accounts for sticky header + padding (px)
}: {
  items: TabItem[];
  offsetTop?: number;
}) {
  const [activeId, setActiveId] = useState<string>(items?.[0]?.id || "");
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (!ids.length) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    // Decide "active" based on which section is closest to the top zone.
    // Use a rootMargin that creates a "top band" where the section becomes active.
    const observer = new IntersectionObserver(
      (entries) => {
        // Collect visible entries
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            id: (e.target as HTMLElement).id,
            top: e.boundingClientRect.top,
          }));

        if (!visible.length) return;

        // Choose the one closest to the top (but still within viewport)
        visible.sort((a, b) => Math.abs(a.top) - Math.abs(b.top));
        const next = visible[0]?.id;

        if (next && next !== activeIdRef.current) {
          setActiveId(next);
        }
      },
      {
        // Make a "activation band" near the top:
        // When the section enters this band, it becomes active.
        root: null,
        rootMargin: `-${offsetTop}px 0px -65% 0px`,
        threshold: [0.01, 0.1, 0.25],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offsetTop]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    // update active immediately for perceived responsiveness
    setActiveId(id);

    // smooth scroll with offset
    const y = el.getBoundingClientRect().top + window.scrollY - offsetTop;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div
      className="
        sticky top-3 z-20 mt-5
        rounded-2xl border border-slate-900/10
        bg-white/70 backdrop-blur-md
        shadow-[0_10px_30px_rgba(2,6,23,0.08)]
        px-3 py-3
      "
      aria-label="Section navigation"
    >
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const isActive = it.id === activeId;

          return (
            <button
              key={it.id}
              type="button"
              onClick={() => scrollTo(it.id)}
              className={[
                "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                isActive
                  ? "border-slate-900/20 bg-slate-900 text-white shadow-[0_10px_24px_rgba(2,6,23,0.18)]"
                  : "border-slate-900/10 bg-white/70 text-slate-700 hover:bg-slate-50 hover:scale-[1.02]",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative">
                {it.label}
                <span
                  className={[
                    "absolute -bottom-1 left-0 h-[2px] transition-all duration-200",
                    isActive ? "w-full bg-white/80" : "w-0 bg-slate-900/70 group-hover:w-full",
                  ].join(" ")}
                />
              </span>

              {it.isLocked ? (
                <span
                  className={[
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    isActive
                      ? "border-white/20 bg-white/10 text-white/80"
                      : "border-slate-900/10 bg-white text-slate-500",
                  ].join(" ")}
                >
                  Locked
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
