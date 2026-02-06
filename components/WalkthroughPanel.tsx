"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { makeCroppedCloudinaryUrl } from "@/lib/cloudinary";

type Step = {
  _id: string;
  order: number;
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

export function WalkthroughPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const sorted = useMemo(() => [...steps].sort((a, b) => a.order - b.order), [steps]);

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

      setSteps(((data as any).app?.walkthrough || []) as Step[]);
    } catch (e: any) {
      setError(e.message || "Failed to load walkthrough");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  async function addStep(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}/walkthrough`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl: imageUrl || undefined
        })
      });

      setSteps((data as any).walkthrough || []);
      setTitle("");
      setDescription("");
      setImageUrl("");
    } catch (e: any) {
      setError(e.message || "Failed to add step");
    }
  }

  async function deleteStep(stepId: string) {
    setError("");
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}/walkthrough/${stepId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setSteps((data as any).walkthrough || []);
    } catch (e: any) {
      setError(e.message || "Failed to delete step");
    }
  }

  function move(index: number, dir: -1 | 1) {
    const arr = [...sorted];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;

    const tmp = arr[index];
    arr[index] = arr[newIndex];
    arr[newIndex] = tmp;

    const updated = arr.map((s, i) => ({ ...s, order: i + 1 }));
    setSteps(updated);
  }

  async function saveOrder() {
    setError("");
    setSavingOrder(true);
    try {
      const token = await getToken();
      if (!token) return;

      const stepIds = sorted.map((s) => s._id);

      const data = await apiFetch(`/apps/${appId}/walkthrough/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stepIds })
      });

      setSteps((data as any).walkthrough || []);
    } catch (e: any) {
      setError(e.message || "Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  }

  const stepsWithImages = sorted.filter((s) => !!s.imageUrl);
  const stepImageUrls = stepsWithImages.map((s) => s.imageUrl as string);

  return (
    <section style={{ marginTop: 12 }}>
      <h2 
       className="text-black text-xl font-black tracking-tight font-serif pb-4"  
      >
        Walkthrough
      </h2>

      <form 
        onSubmit={addStep} 
        className="text-sm text-slate-500 mt-1 font-serif"
      >
        <label  className="text-sm text-slate-600 font-serif">
          Step title<span className="text-danger">*</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter the step title"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            className="text-sm text-primary mt-1 font-serif placeholder:text-black/20 mb-4"
          />
        </label>

        <label>
          Description<span className="text-danger">*</span>
          <textarea
            value={description}
            placeholder="Enter a short description about your app"
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8, minHeight: 90 }}
            className="text-sm text-primary mt-1 font-serif placeholder:text-black/20 mb-4"
          />
        </label>

        <label>
          Image URL (optional)
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            className="text-sm text-primary mt-1 font-serif placeholder:text-black/20 mb-4"
          />
        </label>

        {/* <button style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}>
          Add step
        </button> */}
        <button 
          className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
          
        >
          Add step
        </button>
      </form>

      {loading ? <p style={{ marginTop: 10 }}>Loading...</p> : null}
      {error ? <p style={{ marginTop: 10, color: "crimson" }}>{error}</p> : null}

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {sorted.map((s, idx) => {
          const imgIndex = stepsWithImages.findIndex((x) => x._id === s._id);
          
          return (
          <div key={s._id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>
                  #{s.order} — {s.title}
                </div>
                {s.description ? (
                  <div style={{ marginTop: 6, color: "#555" }}>{s.description}</div>
                ) : null}
                {s.imageUrl ? (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={s.imageUrl} 
                      alt="" 
                      style={{ width: 220, 
                      borderRadius: 10, 
                      border: "1px solid #eee", 
                      cursor: "zoom-in"
                      }}
                      onClick={() => {
                        // setSelectedStep(s);
                        // setViewerIndex(idx);
                        setViewerIndex(imgIndex);
                        setViewerOpen(true);
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div style={{ display: "grid", gap: 8, alignSelf: "center" }}>
                <button onClick={() => move(idx, -1)} style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 10 }}>
                  ↑
                </button>
                <button onClick={() => move(idx, 1)} style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 10 }}>
                  ↓
                </button>
                <button onClick={() => deleteStep(s._id)} style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 10 }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>

      {sorted.length > 1 ? (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}
          >
            {savingOrder ? "Saving..." : "Save order"}
          </button>
        </div>
      ) : null}

      {!loading && sorted.length === 0 ? (
        <p style={{ marginTop: 10, color: "#666" }}>No steps yet. Add 3–6 key steps.</p>
      ) : null}
      {/* <ImageViewerModal
        open={viewerOpen && !!selectedStep?.imageUrl}
        imageUrl={selectedStep?.imageUrl || ""}
        onClose={() => {
          setViewerOpen(false);
          setSelectedStep(null);
        }}
        onSaveCrop={async (cropPixels) => {
          if (!selectedStep?.imageUrl) return;

          const token = await getToken();
          if (!token) return;

          const newUrl = makeCroppedCloudinaryUrl(selectedStep.imageUrl, cropPixels);

          const data = await apiFetch(`/apps/${appId}/walkthrough/${selectedStep._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              imageUrl: newUrl
            })
          });

          setSteps((data as any).walkthrough || []);
          setViewerOpen(false);
          setSelectedStep(null);
        }}
      /> */}
      <ImageViewerModal
        open={viewerOpen}
        images={stepImageUrls}
        startIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onSaveCrop={async (index, cropPixels) => {
          const token = await getToken();
          if (!token) return;

          const targetStep = stepsWithImages[index];
          if (!targetStep?.imageUrl) return;

          const newUrl = makeCroppedCloudinaryUrl(targetStep.imageUrl, cropPixels);

          const data = await apiFetch(`/apps/${appId}/walkthrough/${targetStep._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ imageUrl: newUrl })
          });

          setSteps((data as any).walkthrough || []);
        }}
      />
    </section>
  );
}
