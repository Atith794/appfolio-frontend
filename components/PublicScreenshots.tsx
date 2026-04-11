"use client";

import { useMemo, useState } from "react";
import { PhoneFrame, NotchType } from "@/components/PhoneFrame";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FramedPreviewModal } from "@/components/FramedPreviewModal";

type Screenshot = {
  _id?: string;
  url: string;
  width?: number;
  height?: number;
  order?: number;
  groupKey?: string;
};

type ScreenshotGroup = {
  key: string;
  title: string;
  description?: string;
};

type PublicScreenshotsProps = {
  appName?: string;
  screenshots: Screenshot[];
  screenshotGroups?: ScreenshotGroup[];
  isPremium: boolean;
  platforms?: string[];
};

type RenderRowProps = {
  rowId: string;
  title?: string;
  description?: string;
  items: Screenshot[];
  allImages: string[];
  getGlobalIndex: (shot: Screenshot) => number;
  appName: string;
  notch: NotchType;
  onOpen: (index: number) => void;
};

function ScreenshotRow({
  rowId,
  title,
  description,
  items,
  allImages,
  getGlobalIndex,
  appName,
  notch,
  onOpen,
}: RenderRowProps) {
  const scrollId = `screenshots-row-${rowId}`;

  const scrollByAmount = (amount: number) => {
    const el = document.getElementById(scrollId);
    el?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <div className="relative">
      {title ? (
        <div className="mb-5 px-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8fbff] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f8fbff] to-transparent" />

        <button
          type="button"
          onClick={() => scrollByAmount(-420)}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition hover:bg-white cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => scrollByAmount(420)}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 p-3 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition hover:bg-white cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          id={scrollId}
          className="flex gap-8 overflow-x-auto scroll-smooth px-14 py-4 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((shot, idx) => {
            const globalIndex = getGlobalIndex(shot);

            return (
              <button
                key={shot._id ?? `${shot.url}-${idx}`}
                type="button"
                onClick={() => onOpen(globalIndex)}
                className="group shrink-0 text-center cursor-pointer"
              >
                <div className="mx-auto w-[220px] sm:w-[240px] lg:w-[260px]">
                  <PhoneFrame
                    src={shot.url}
                    alt={`${appName} screenshot ${globalIndex + 1}`}
                    fit="cover"
                    notch={notch}
                    aspect="9/19.5"
                    variant="gallery"
                    className="transition duration-200 group-hover:-translate-y-1"
                  />
                </div>

                <div className="mt-4 text-base font-medium text-slate-600">
                  Screen {globalIndex + 1}
                </div>
              </button>
            );
          })}
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}

export default function PublicScreenshots({
  appName = "App",
  screenshots,
  screenshotGroups = [],
  isPremium,
  platforms = [],
}: PublicScreenshotsProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const orderedScreenshots = useMemo(() => {
    return [...(screenshots || [])]
      .filter((s) => Boolean(s?.url))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [screenshots]);

  const allImages = useMemo(
    () => orderedScreenshots.map((s) => s.url).filter(Boolean),
    [orderedScreenshots]
  );

  const isIOS = useMemo(
    () =>
      platforms.some((p) => {
        const v = String(p).toUpperCase();
        return v === "IOS" || v === "APPLE";
      }),
    [platforms]
  );

  const notch: NotchType = isIOS ? "iphone-pill" : "android-center-hole";

  const groupedRows = useMemo(() => {
    if (!isPremium) return [];

    const groupsMap = new Map(
      (screenshotGroups || []).map((g) => [g.key, g])
    );

    const buckets = new Map<string, Screenshot[]>();

    for (const shot of orderedScreenshots) {
      const key = String(shot.groupKey || "").trim();
      if (!key) continue;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(shot);
    }

    const rows = Array.from(buckets.entries())
      .map(([key, items]) => ({
        key,
        title: groupsMap.get(key)?.title || key,
        description: groupsMap.get(key)?.description || "",
        items: items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        firstOrder: Math.min(...items.map((x) => x.order ?? 0)),
      }))
      .sort((a, b) => a.firstOrder - b.firstOrder);

    return rows;
  }, [isPremium, screenshotGroups, orderedScreenshots]);

  const hasGroupedRows = groupedRows.length > 0;

  const getGlobalIndex = (shot: Screenshot) => {
    return orderedScreenshots.findIndex((x) =>
      shot._id && x._id ? x._id === shot._id : x.url === shot.url
    );
  };

  const openAt = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  if (!allImages.length) return null;

  return (
    <>
      <div className="space-y-10">
        {isPremium && hasGroupedRows ? (
          groupedRows.map((group) => (
            <ScreenshotRow
              key={group.key}
              rowId={group.key}
              title={group.title}
              description={group.description}
              items={group.items}
              allImages={allImages}
              getGlobalIndex={getGlobalIndex}
              appName={appName}
              notch={notch}
              onOpen={openAt}
            />
          ))
        ) : (
          <ScreenshotRow
            rowId="all"
            items={orderedScreenshots}
            allImages={allImages}
            getGlobalIndex={getGlobalIndex}
            appName={appName}
            notch={notch}
            onOpen={openAt}
          />
        )}
      </div>

      <FramedPreviewModal
        open={open}
        images={allImages}
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