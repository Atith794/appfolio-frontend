"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiFetch } from "@/lib/api";
import { Info } from "lucide-react";
import { ImageViewerModal } from "./ImageViewerModal";
import { redirect } from "next/navigation";

type AppHero = {
  name: string;
  platform: ("ANDROID" | "IOS" | "WINDOWS")[];
  appIconUrl?: string;
};

const PLATFORMS: { key: AppHero["platform"][number]; label: string }[] = [
  { key: "ANDROID", label: "Android" },
  { key: "IOS", label: "Apple (iOS)" },
  { key: "WINDOWS", label: "Windows" },
];

export function AppHeroPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [hero, setHero] = useState<AppHero>({
    name: "",
    platform: ["ANDROID"],
    appIconUrl: "",
  });

  const dirty = useMemo(() => {
    // simple heuristic: enable save if name exists
    return hero.name.trim().length >= 2 && hero.platform.length >= 1;
  }, [hero]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const app = (data as any).app;

      setHero({
        name: app?.name || "",
        platform: (app?.platform || ["ANDROID"]) as AppHero["platform"],
        appIconUrl: app?.appIconUrl || "",
      });
    } catch (e: any) {
      setError(e.message || "Failed to load app");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [appId]);

  function togglePlatform(p: AppHero["platform"][number]) {
    setHero((prev) => {
      const exists = prev.platform.includes(p);
      const next = exists ? prev.platform.filter((x) => x !== p) : [...prev.platform, p];

      // Must have at least 1 platform
      if (next.length === 0) return prev;

      return { ...prev, platform: next };
    });
  }

  async function uploadIcon(file: File) {
    setError("");
    setUploading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // signature (same as screenshots)
      const sig = await apiFetch("/uploads/cloudinary-signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

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

      setHero((p) => ({ ...p, appIconUrl: uploadRes.data.secure_url }));
    } catch (e: any) {
      setError(e.message || "Icon upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setError("");
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      await apiFetch(`/apps/${appId}/hero`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: hero.name.trim(),
          platform: hero.platform,
          appIconUrl: hero.appIconUrl || "",
        }),
      });

      alert("App Hero saved!");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save App Hero");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="grid gap-4 md:grid-cols-[140px_1fr] items-start">
       
        {/* Icon */}
        <div className="flex flex-col gap-2">
          <div className="w-[120px] h-[120px] rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-white flex items-center justify-center">
            {hero.appIconUrl ? (
              <img
                src={hero.appIconUrl}
                alt="App icon"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  setViewerOpen(true);
                }}
              />
            ) : (
              <span className="text-xs text-slate-400 px-2 text-center">
                No icon yet
              </span>
            )}
          </div>

          <label className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer text-center">
            {uploading ? "Uploading..." : "Upload icon"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadIcon(f);
              }}
            />
          </label>

          {hero.appIconUrl ? (
            <button
              type="button"
              onClick={() => setHero((p) => ({ ...p, appIconUrl: "" }))}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-danger/10 text-danger hover:bg-danger/20"
            >
              Remove
            </button>
          ) : null}
        </div>

        {/* Fields */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-slate-700">App name</label>
              <input
                value={hero.name}
                onChange={(e) => setHero((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Peti — Social app for pets"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
              <p className="text-xs text-slate-400">{hero.name.trim().length}/80</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">Platforms</label>

              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const active = hero.platform.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => togglePlatform(p.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        active
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <p className="flex items-center gap-1 text-xs font-medium text-primary/80">
                <Info size={14} />
                <span>Select at least one platform.</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={save}
                disabled={saving || !dirty}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save App Hero"}
              </button>

              <button
                onClick={load}
                disabled={loading || saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                Reset
              </button>
            </div>

            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm" style={{ color: "crimson" }}>{error}</p> : null}
          </div>
        </div>
        <ImageViewerModal
          open={viewerOpen}
          images={[hero?.appIconUrl]}
          startIndex={0}
          onClose={() => setViewerOpen(false)}
          onSaveCrop={
            async () => {
              console.log("Image")
            }
          }
        />
      </div>
    </section>
  );
}