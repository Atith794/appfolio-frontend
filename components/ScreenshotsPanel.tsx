"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiFetch, API_BASE } from "@/lib/api";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { makeCroppedCloudinaryUrl } from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { Info, MoveDown, MoveLeft, MoveRight, MoveUp, Trash2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Screenshot = {
  _id: string;
  url: string;
  width?: number;
  height?: number;
  order: number;
  caption?: string;
};

export function ScreenshotsPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading,setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState("");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE");
  const [screenshotLimit, setScreenshotLimit] = useState<number>(6);
  const [screenshotsUsed, setScreenshotsUsed] = useState<number>(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState<Screenshot | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const limitReached = screenshotsUsed >= screenshotLimit;

  const sorted = useMemo(
    () => [...screenshots].sort((a, b) => a.order - b.order),
    [screenshots]
  );

  async function load() {
    setError("");
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });

      const app = (data as any).app;
      const meta = (data as any).meta;

      setScreenshots(((data as any).app?.screenshots || []) as Screenshot[]);
      if (meta?.plan) setPlan(meta.plan);
      if (meta?.screenshotLimit) setScreenshotLimit(meta.screenshotLimit);
      if (typeof meta?.screenshotsUsed === "number") setScreenshotsUsed(meta.screenshotsUsed);

      setScreenshotsUsed((app?.screenshots || []).length);


    } catch (e: any) {
      setError(e.message || "Failed to load app");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appId]);

  async function uploadFiles(files: FileList) {
    setError("");
    setUploading(true);
    try{
      const token = await getToken();
      if (!token) return;

      // get signature once per batch
      const sig = await apiFetch("/uploads/cloudinary-signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", (sig as any).apiKey);
        form.append("timestamp", String((sig as any).timestamp));
        form.append("signature", (sig as any).signature);
        form.append("folder", (sig as any).folder);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME missing");

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          form
        );

        await apiFetch(`/apps/${appId}/screenshots`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            url: uploadRes.data.secure_url,
            width: uploadRes.data.width,
            height: uploadRes.data.height
          })
        });
      }
    }catch(err: any){
        const matches = err.message.match(/\d+/);
        if(matches){
          const limit = parseInt(matches[0]);
          if (limit === 6) {
              alert("Please upgrade to pro to upload upto 12 screenshots");
          } else {
              alert("Maximum screenshot upload limit reached");
          }
          window.location.href = "/pricing";
          return;
        }
        else{
          console.error("Screenshots upload error:",err);
        }
    }
    finally{
      setUploading(false);
      await load();
    }
  }

  function move(index: number, dir: -1 | 1) {
    const arr = [...sorted];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;

    const tmp = arr[index];
    arr[index] = arr[newIndex];
    arr[newIndex] = tmp;

    // update local order (1..n)
    const updated = arr.map((s, i) => ({ ...s, order: i + 1 }));
    setScreenshots(updated);
  }

  async function saveOrder() {
    setError("");
    setSavingOrder(true);
    try {
      const token = await getToken();
      if (!token) return;

      const screenshotIds = sorted.map((s) => s._id);

      const data = await apiFetch(`/apps/${appId}/screenshots/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ screenshotIds })
      });
      alert("Order saved successfully!!");
      setScreenshots((data as any).screenshots || []);
    } catch (e: any) {
      setError(e.message || "Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  }

  //Delete screenshots
  async function deleteScreenshot(screenshotId: string) {
    const ok = window.confirm("Delete this screenshot? This cannot be undone.");
    if (!ok) return;

    setError("");
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}/screenshots/${screenshotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setScreenshots((data as any).screenshots || []);
      setScreenshotsUsed(((data as any).screenshots || []).length);
    } catch (e: any) {
      setError(e.message || "Failed to delete screenshot");
    }
  }

  //Drag and drop feature
  function arrayMove<T>(array: T[], from: number, to: number) {
    const copy = [...array];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  function SortableScreenshotCard({
    id,
    children,
  }: {
    id: string;
    children: (props: {
      setNodeRef: (node: HTMLElement | null) => void;
      style: React.CSSProperties;
      handleProps: React.HTMLAttributes<HTMLElement>;
      isDragging: boolean;
    }) => React.ReactNode;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.75 : 1,
    };

    // IMPORTANT: attach listeners+attributes to handle ONLY
    const handleProps = { ...attributes, ...listeners };

    return <>{children({ setNodeRef, style, handleProps, isDragging })}</>;
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((x) => x._id === active.id);
    const newIndex = sorted.findIndex((x) => x._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const rearranged = arrayMove(sorted, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i + 1,
    }));

    setScreenshots(rearranged);
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="w-full flex items-center gap-3 justify-start sm:justify-between">
        <div className="flex items-center gap-[10px]">
          <p className="text-sm text-slate-500 mt-1 font-serif hidden sm:block">
            {screenshotsUsed}/{screenshotLimit} used
          </p>

           {plan === "FREE" ? (
              limitReached ? (
                // When limit reached: Upload becomes Upgrade CTA
                <button
                  type="button"
                  onClick={() => (window.location.href = "/pricing")}
                  className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
                  title="Upgrade to Pro to upload more screenshots"
                >
                  {uploading ? 'Uploading ...' : 'Upload'}
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid #111"
                    }}
                  >
                    PRO
                  </span>
                </button>
              ) : (
                // Normal Upload (no badge)
                <label
                  className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
                  title="Upload screenshots"
                >
                  {uploading ? 'Uploading ...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                  />
                </label>
              )
            ) : (
              // PRO plan
              !limitReached ? (
                <label
                  className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
                  title="Upload screenshots"
                >
                  {uploading ? 'Uploading ...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                  />
                </label>
              ) : null
            )}
        </div>

        <div className="flex items-center">
          <button
            onClick={() => redirect("/dashboard/onboard")}
            className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
          >
           Dashboard
          </button>
        </div>
      </div>

      {loading ? <p style={{ marginTop: 10 }}>Loading...</p> : null}
      {error ? <p style={{ marginTop: 10, color: "crimson" }}>{error}</p> : null}

      {!loading && sorted.length === 0 ? (
        <p style={{ marginTop: 10, color: "#666" }}>No screenshots yet. Upload a few.</p>
      ) : null}

      {/* Show screenshots */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={sorted.map((s) => s._id)}
          strategy={rectSortingStrategy}
        >
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              alignItems: "start",
            }}
          >
            {sorted.map((s, idx) => (
              <SortableScreenshotCard key={s._id} id={s._id}>
                {({ setNodeRef, style, handleProps, isDragging }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={`group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 md:p-6 lg:p-6 hover:border-primary/50 hover:bg-primary/5 transition-all ${
                      isDragging ? "ring-2 ring-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    {/* Header row: order + drag handle */}
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-semibold text-primary font-serif">
                        {s.order}.
                      </div>

                      {/* Drag handle (ONLY this starts dragging) */}
                      <button
                        type="button"
                        {...handleProps}
                        className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 cursor-grab active:cursor-grabbing touch-none"
                        title="Drag to reorder"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical size={18} />
                      </button>
                    </div>

                    {/* Your existing content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                      <div className="flex items-center gap-2">
                        <img
                          src={s.url}
                          alt=""
                          onClick={() => {
                            setViewerIndex(idx);
                            setViewerOpen(true);
                          }}
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid #eee",
                            cursor: "pointer",
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => move(idx, -1)}
                          className="px-4 py-2 my-5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        >
                          <span className="block min-[581px]:hidden"><MoveUp size={18}/></span>
                          <span className="hidden min-[581px]:block"><MoveLeft size={18}/></span>
                        </button>

                        <button
                          onClick={() => move(idx, 1)}
                          className="px-4 py-2 my-5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        >
                          {/* <MoveRight size={18} /> */}
                          <span className="block min-[581px]:hidden"><MoveDown size={18}/></span>
                          <span className="hidden min-[581px]:block"><MoveRight size={18}/></span>
                        </button>

                        <button
                          onClick={() => deleteScreenshot(s._id)}
                          className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-danger/10 text-danger hover:bg-danger/30 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </SortableScreenshotCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {sorted.length > 1 ? (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            className="px-4 py-2 my-5 rounded-lg text-l font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          >
            {savingOrder ? "Saving..." : "Save order"}
          </button>
        </div>
      ) : null}

      <p className="flex items-center gap-1 text-xs font-medium text-primary/80">
        <Info size={14} />
        <span>
          Arrange screenshots in the exact order you want for it to appear on the public appfolio.
        </span>
      </p>
    
      <ImageViewerModal
        open={viewerOpen}
        images={sorted.map((x) => x.url)}
        startIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onSaveCrop={async (index, cropPixels) => {
          const token = await getToken();
          if (!token) return;

          const target = sorted[index];
          if (!target) return;

          const newUrl = makeCroppedCloudinaryUrl(target.url, cropPixels);

          const data = await apiFetch(`/apps/${appId}/screenshots/${target._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              url: newUrl,
              width: Math.round(cropPixels.width),
              height: Math.round(cropPixels.height)
            })
          });

          setScreenshots((data as any).screenshots || []);
        }}
      />
    </section>
  );
}
