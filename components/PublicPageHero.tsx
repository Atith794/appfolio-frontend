"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiFetch } from "@/lib/api";
import { Info, Upload, X } from "lucide-react";
import { ImageViewerModal } from "./ImageViewerModal";

type AppHero = {
  name: string;
  platform: ("ANDROID" | "IOS" | "WINDOWS")[];
  appIconUrl?: string;
};

const PLATFORMS: { key: AppHero["platform"][number]; label: string; short: string }[] = [
  { key: "ANDROID", label: "Android", short: "Android" },
  { key: "IOS", label: "Apple (iOS)", short: "iOS" },
  { key: "WINDOWS", label: "Windows", short: "Windows" },
];

export default function AppHeroPanel({ appId }: { appId: string }) {
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
      if (next.length === 0) return prev; // must have at least 1
      return { ...prev, platform: next };
    });
  }

  async function uploadIcon(file: File) {
    setError("");
    setUploading(true);
    try {
      const token = await getToken();
      if (!token) return;

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

      await load();
    } catch (e: any) {
      setError(e.message || "Failed to save App Hero");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-4">
      <div className="rounded-3xl border border-slate-900/10 bg-white shadow-sm">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-900/10">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">Hero</div>
            <div className="text-xs text-slate-500">
              This is what shows first on your public page.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading || saving}
              className="rounded-xl px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
            >
              Reset
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-[128px_1fr] items-start">
            {/* Icon */}
            <div className="flex flex-col gap-2">
              <div
                className="group relative h-28 w-28 rounded-2xl bg-slate-50 border border-slate-900/10 shadow-sm overflow-hidden grid place-items-center"
                title={hero.appIconUrl ? "Click to preview" : "Upload an app icon"}
              >
                {hero.appIconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hero.appIconUrl}
                    alt="App icon"
                    className="h-full w-full object-cover cursor-pointer"
                    onClick={() => setViewerOpen(true)}
                  />
                ) : (
                  <div className="text-xs text-slate-500 text-center px-3">
                    No icon
                    <div className="mt-1 text-[11px] text-slate-400">Upload a square image</div>
                  </div>
                )}

                {/* subtle hover ring */}
                <div className="pointer-events-none absolute inset-0 ring-2 ring-transparent group-hover:ring-primary/30 transition" />
              </div>

              <label className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadIcon(f);
                    e.currentTarget.value = ""; // allows re-upload same file
                  }}
                />
              </label>

              {hero.appIconUrl ? (
                <button
                  type="button"
                  onClick={() => setHero((p) => ({ ...p, appIconUrl: "" }))}
                  className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <X size={16} />
                  Remove
                </button>
              ) : null}
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">App name</label>
                <input
                  value={hero.name}
                  onChange={(e) => setHero((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Peti — Social app for pets"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">{hero.name.trim().length}/80</p>
                  <p className="text-[11px] text-slate-400">
                    Keep it short and recruiter-friendly
                  </p>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-slate-800">Platforms</label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Info size={14} />
                    Pick at least one
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => {
                    const active = hero.platform.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => togglePlatform(p.key)}
                        className={[
                          "rounded-full px-3 py-1.5 text-sm font-semibold border transition",
                          active
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {p.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error / loading */}
              {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          {/* Preview hint */}
          <div className="mt-5 rounded-2xl border border-slate-900/10 bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold text-slate-700">Public page preview behavior</div>
            <div className="mt-1 text-xs text-slate-500">
              Your icon + name + platforms appear at the top, followed by screenshots and the product breakdown.
            </div>
          </div>
        </div>
      </div>

      <ImageViewerModal
        open={viewerOpen}
        images={[hero?.appIconUrl].filter(Boolean)}
        startIndex={0}
        onClose={() => setViewerOpen(false)}
        onSaveCrop={async () => {
          // later: integrate cropping if needed
        }}
      />
    </section>
  );
}
