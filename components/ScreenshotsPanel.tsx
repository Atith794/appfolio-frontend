"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiFetch, API_BASE } from "@/lib/api";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { makeCroppedCloudinaryUrl } from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { Info, MoveDown, MoveLeft, MoveRight, MoveUp, Trash2, GripVertical, Eye, Edit, Pencil } from 'lucide-react'
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
import { PhoneFrame } from "./PhoneFrame";
import { FramedPreviewModal } from "@/components/FramedPreviewModal";

type Screenshot = {
  _id: string;
  url: string;
  width?: number;
  height?: number;
  order: number;
  caption?: string;
  groupKey?: string;
};

type ScreenshotGroup = {
  key: string;
  title: string;
  description?: string;
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
  const [framePreviewOpen, setFramePreviewOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [screenshotGroups, setScreenshotGroups] = useState<ScreenshotGroup[]>([]);

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
      setScreenshotGroups(((data as any).app?.screenshotGroups || []) as ScreenshotGroup[]);

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

  function slugify(s: string) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function createGroupSafe(title: string, description: string) {
    const token = await getToken();
    if (!token) return;

    const base = slugify(title) || "group";
    let key = base;

    for (let i = 1; i <= 10; i++) {
      try {
        await apiFetch(`/apps/${appId}/screenshot-groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key,
            title,
            description,
          }),
        });

        return; // ✅ success
      } catch (err: any) {
        // If backend returned 409 (group key exists)
        if (err?.message?.includes("409") || err?.message?.includes("exists")) {
          key = `${base}-${i + 1}`;
          continue;
        }

        console.error("Create group error:", err);
        alert("Failed to create group");
        throw err;
      }
    }

    alert("Could not create a unique group key. Try a different title.");
  }

  function uniqueKey(base: string, existing: Set<string>) {
    if (!existing.has(base)) return base;
    for (let i = 2; i <= 50; i++) {
      const k = `${base}-${i}`;
      if (!existing.has(k)) return k;
    }
    return `${base}-${Date.now()}`;
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

  const groupedForUI = useMemo(() => {
    if (plan !== "PRO") return null;

    const groupsByKey = new Map(screenshotGroups.map(g => [g.key, g]));
    const buckets = new Map<string, Screenshot[]>();

    for (const shot of sorted) {
      const key = shot.groupKey?.trim() || "";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(shot);
    }

    // order groups by earliest screenshot.order (keeps your existing reorder behavior)
    const keys = Array.from(buckets.keys()).sort((a, b) => {
      const aMin = Math.min(...buckets.get(a)!.map(x => x.order));
      const bMin = Math.min(...buckets.get(b)!.map(x => x.order));
      return aMin - bMin;
    });

    return keys.map((key) => ({
      key,
      meta: key ? groupsByKey.get(key) : undefined,
      items: buckets.get(key)!.sort((x,y)=>x.order-y.order),
    }));
  }, [plan, sorted, screenshotGroups]);

  const shotsByGroup = useMemo(() => {
    const map = new Map<string, Screenshot[]>();
    for (const s of sorted) {
      const k = (s.groupKey ?? "").trim();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    return map;
  }, [sorted]);

  const THUMB = 48; // 12 * 4px = 48px (h-12 w-12)
  const GAP = 8;    // gap-2 = 8px
  const VISIBLE = 6;

  const stripWidth = VISIBLE * THUMB + (VISIBLE - 1) * GAP; // 6 thumbs + 5 gaps

  return (
    <section style={{ marginTop: 16 }}>
      <div className="w-full flex items-center gap-3 justify-start sm:justify-between">
        <div className="flex items-center gap-[10px]">
          <p className="text-sm text-slate-500 mt-1 font-serif hidden sm:block">
            {screenshotsUsed}/{screenshotLimit} used
          </p>

          {/* Manage screenshots */}



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
                      border: "2px solid #6366f1",
                      marginLeft: "12px"
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
                      
                      <div>
                        <button
                          title="Preview"
                          type="button"
                          onClick={() => {
                            setFrameIndex(idx);
                            setFramePreviewOpen(true);
                          }}
                          className="px-4 py-2 my-5 rounded-lg text-sm font-medium text-primary hover:bg-slate-200 cursor-pointer"
                        >
                          <Eye />
                        </button>
                        {/* Drag handle (ONLY this starts dragging) */}
                        <button
                          type="button"
                          {...handleProps}
                          className="p-2 rounded-lg text-primary hover:text-primary hover:bg-primary/10 cursor-grab active:cursor-grabbing touch-none"
                          title="Drag to reorder"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical size={18} />
                        </button>
                      </div>
                    </div>
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
                       {plan === "PRO" ? (
                        <div className="mt-2">
                          <label className="text-xs text-slate-500 font-serif">Group</label>
                          <select
                            value={s.groupKey ?? ""}
                            onChange={async (e) => {
                              const groupKey = e.target.value; // should now be "onboarding"
                              console.log("Selected groupKey:", groupKey);
                              setScreenshots(prev =>
                                prev.map(x => (x._id === s._id ? { ...x, groupKey } : x))
                              );
                              try{
                                const token = await getToken();
                                if (!token) return;
                                console.log("Value in select:",e.target.value);
                                await apiFetch(`/apps/${appId}/screenshots/${s._id}`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ groupKey: e.target.value }),
                                });

                                await load();
                              }catch(e){
                                console.error(e);
                                // rollback if needed
                                await load();
                              }
                              
                            }}
                            className="mt-1 w-full px-2 py-2 rounded-lg text-sm bg-primary/10 text-primary font-mono"
                          >
                            
                            <option value="">Ungrouped</option>
                            { screenshotGroups.map((g) => (
                              <option key={(g as any).key ?? (g as any)._id ?? g.title} value={g.key}>
                                {g.title} — key: {(g as any).key}
                              </option>
                            ))}

                          </select>
                        </div>
                      ) : null}
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
          <p className="flex items-center gap-1 text-xs font-medium text-primary/80">
            <Info size={14} />
            <span>
              Arrange screenshots in the exact order you want for it to appear on the public appfolio.
            </span>
          </p>
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            className="px-4 py-2 my-5 rounded-lg text-l font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          >
            {savingOrder ? "Saving..." : "Save Order"}
          </button>
        </div>
      ) : null}
      {plan === "PRO" ? (
        <div className="border rounded-2xl p-4 bg-slate-50 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900 font-serif">Screenshot groups</div>
              <div className="text-sm text-slate-500 font-serif">
                Create sections like Onboarding, Home, Checkout.
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const title = prompt("Group title (ex: Onboarding)")?.trim();
                if (!title) return;
                const description = prompt("Small description (optional)")?.trim() || "";

                await createGroupSafe(title, description);

                await load();
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
            >
              + Create group
            </button>
          </div>

          {screenshotGroups.length ? (
            
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {screenshotGroups.map((g) => {
                const groupShots = shotsByGroup.get(g.key) || [];
                const ungrouped = shotsByGroup.get("") || [];

                return (
                <div key={g.key} className="rounded-xl border bg-white p-3">
                  <div className="font-medium text-slate-900 font-serif">
                    {g.title}
                    <button
                      className="mx-3 px-3 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono cursor-pointer"
                      onClick={async () => {
                        const title = prompt("Edit title", g.title)?.trim();
                        if (!title) return;
                        const description = prompt("Edit description", g.description || "")?.trim() || "";

                        const token = await getToken();
                        if (!token) return;

                        await apiFetch(`/apps/${appId}/screenshot-groups/${g.key}`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ title, description }),
                        });

                        await load();
                      }}
                    >
                      <Pencil  size={12}/>
                      {/* <Edit size={8}/> */}
                    </button>
                  </div>
                  {g.description ? (
                    <div className="text-sm text-slate-500 mt-1 font-serif">{g.description}</div>
                  ) : null}
                  <div className="mt-3 text-xs text-slate-500 font-mono">
                    {groupShots.length} screenshot{groupShots.length === 1 ? "" : "s"}
                  </div>

                  {groupShots.length ? (
                    <div
                      className="mt-2"
                      style={{ width: stripWidth }}
                    >
                      <div
                        className="flex gap-2 overflow-x-auto pb-2"
                        style={{
                          scrollbarWidth: "thin",          // Firefox
                          WebkitOverflowScrolling: "touch" // iOS smooth
                        }}
                      >
                        {groupShots.map((shot) => {
                          const idx = sorted.findIndex((x) => x._id === shot._id);
                          return (
                            <img
                              key={shot._id}
                              src={shot.url}
                              alt=""
                              onClick={() => {
                                setViewerIndex(idx);
                                setViewerOpen(true);
                              }}
                              className="
                                h-12 w-12 flex-none rounded-lg
                                border border-slate-200 object-cover cursor-pointer
                                transition-transform duration-150
                                hover:scale-[1.03]
                                hover:border-primary/60 hover:ring-2 hover:ring-primary/20
                              "
                            />
                          );
                        })}
                      </div>

                      {/* Optional: tiny hint only when scroll exists */}
                      {groupShots.length > 6 ? (
                        <div className="mt-1 text-[11px] text-slate-400 font-mono">
                          Drag/scroll to view more →
                        </div>
                      ) : null}
                    </div>

                  ) : (
                    <div className="mt-2 text-xs text-slate-400 font-mono">No screenshots assigned yet.</div>
                  )}
                  <div className="mt-3 flex gap-2">

                    <button
                      className="px-3 py-1.5 rounded-lg text-xs bg-danger/10 text-danger hover:bg-danger/20 font-mono"
                      onClick={async () => {
                        const ok = confirm(`Delete group "${g.title}"? Screenshots will become ungrouped.`);
                        if (!ok) return;

                        const token = await getToken();
                        if (!token) return;

                        await apiFetch(`/apps/${appId}/screenshot-groups/${g.key}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        await load();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-500 font-mono">No groups yet.</div>
          )}
        </div>
      ) : (
        <div className="border rounded-2xl p-4 bg-slate-50 mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">Screenshot groups</div>
            <div className="text-sm text-slate-500 font-serif">Group screenshots into sections (Pro).</div>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-primary hover:bg-slate-200 hover:cursor-pointer"
            onClick={() => (window.location.href = "/pricing")}
          >
            Unlock <span className="ml-2 text-[11px] px-2 py-[2px] rounded-full border hover:cursor-pointer">PRO</span>
          </button>
        </div>
      )}
    
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

      <FramedPreviewModal
        open={framePreviewOpen}
        images={sorted.map((x) => x.url)}
        startIndex={frameIndex}
        onClose={() => setFramePreviewOpen(false)}
        onSaveCrop={async (index, cropPixels, zoom) => {
          const token = await getToken();
          if (!token) return;

          const target = sorted[index];
          if (!target) return;

          const newUrl = makeCroppedCloudinaryUrl(target.url, cropPixels);

          const data = await apiFetch(`/apps/${appId}/screenshots/${target._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              url: newUrl,
              width: Math.round(cropPixels.width),
              height: Math.round(cropPixels.height),
            }),
          });

          setScreenshots((data as any).screenshots || []);
        }}
        allowCrop={true}
        allowNotchChange={true}
        initialNotch="iphone-pill"
        title="Preview"
      />
    </section>
  );
}