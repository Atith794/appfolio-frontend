"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Info, Plus, Trash2, RotateCcw, Save } from "lucide-react";

const INTRO_MAX = 300;
const MAX_ITEMS = 12;
const KEY_MAX = 40;
const VALUE_MAX = 80;

type KV = { key: string; value: string };

function normalize(items: KV[]) {
  // trim + remove empty rows
  return items
    .map((x) => ({ key: x.key.trim(), value: x.value.trim() }))
    .filter((x) => x.key && x.value)
    .slice(0, MAX_ITEMS);
}

export function IntegrationsPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");

  const [intro, setIntro] = useState("");
  const [items, setItems] = useState<KV[]>([
    { key: "Authentication", value: "Session-based auth" },
    { key: "Media storage", value: "Amazon S3" },
  ]);

  const [initial, setInitial] = useState<{ intro: string; items: KV[] }>({
    intro: "",
    items: [],
  });

  const introTooLong = intro.trim().length > INTRO_MAX;

  const cleaned = useMemo(() => normalize(items), [items]);

  const canAdd = items.length < MAX_ITEMS;

  const hasTooLongKey = useMemo(
    () => items.some((x) => x.key.trim().length > KEY_MAX),
    [items]
  );
  const hasTooLongValue = useMemo(
    () => items.some((x) => x.value.trim().length > VALUE_MAX),
    [items]
  );

  const canSave = !introTooLong && !hasTooLongKey && !hasTooLongValue && cleaned.length >= 1;

  const isDirty = useMemo(() => {
    const a = { intro: intro.trim(), items: normalize(items) };
    const b = { intro: initial.intro.trim(), items: normalize(initial.items) };
    return JSON.stringify(a) !== JSON.stringify(b);
  }, [intro, items, initial]);

  async function load(isReset: boolean) {
    setError("");
    setLoading(true);
    if (isReset) setResetting(true);

    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const app = (data as any).app;
      const integ = app?.integrations || {};

      const nextIntro = String(integ?.intro || "");
      const nextItems: KV[] = Array.isArray(integ?.items)
        ? integ.items.map((x: any) => ({
            key: String(x?.key ?? ""),
            value: String(x?.value ?? ""),
          }))
        : [];

      const fallback: KV[] =
        nextItems.length > 0
          ? nextItems
          : [
              { key: "Authentication", value: "Session / JWT / OAuth" },
              { key: "Media storage", value: "S3 / Cloudinary" },
            ];

      const capped = fallback.slice(0, MAX_ITEMS);

      setIntro(nextIntro);
      setItems(capped);
      setInitial({ intro: nextIntro, items: capped });
    } catch (e: any) {
      setError(e.message || "Failed to load integrations");
    } finally {
      setLoading(false);
      setResetting(false);
    }
  }

  useEffect(() => {
    load(false);
  }, [appId]);

  function setRow(i: number, patch: Partial<KV>) {
    setItems((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], ...patch };
      return copy;
    });
  }

  function addRow() {
    if (!canAdd) return;
    setItems((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeRow(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setError("");
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      await apiFetch(`/apps/${appId}/integrations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intro: intro.trim(),
          items: cleaned,
        }),
      });

      alert("Integrations & key decisions saved!");
      await load(false);
    } catch (e: any) {
      setError(e.message || "Failed to save integrations");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800 font-serif">
              Integrations & Key Decisions
            </h3>
            <p className="text-sm text-slate-500">
              Capture interview-relevant choices like auth, storage, maps, payments, notifications, etc.
            </p>
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={!canAdd}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            title={canAdd ? "Add row" : "Max rows reached"}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Intro */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-700">One-line summary (optional)</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={2}
            placeholder="Example: Session auth + S3 media + Twilio OTP + Google Maps for geocoding."
            className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 ${
              introTooLong
                ? "border-red-300 focus:ring-red-200"
                : "border-slate-200 focus:ring-primary/30 focus:border-primary/40"
            }`}
          />
          <div className={`mt-1 text-xs ${introTooLong ? "text-red-600" : "text-slate-400"}`}>
            {intro.trim().length}/{INTRO_MAX}
          </div>
        </div>

        {/* Table-like rows */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-2 px-2 pb-2 text-xs font-semibold text-slate-500">
            <div className="col-span-4">Key</div>
            <div className="col-span-7">Value</div>
            <div className="col-span-1 text-right"> </div>
          </div>

          <div className="grid gap-2">
            {items.map((row, i) => {
              const keyLen = row.key.trim().length;
              const valLen = row.value.trim().length;
              const keyTooLong = keyLen > KEY_MAX;
              const valTooLong = valLen > VALUE_MAX;

              return (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl border border-slate-100 p-2 hover:bg-slate-50 text-black"
                >
                  <div className="md:col-span-4">
                    <input
                      value={row.key}
                      onChange={(e) => setRow(i, { key: e.target.value })}
                      placeholder="e.g., Authentication"
                      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                        keyTooLong
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-primary/30 focus:border-primary/40"
                      }`}
                    />
                    <div className={`mt-1 text-xs ${keyTooLong ? "text-red-600" : "text-slate-400"}`}>
                      {keyLen}/{KEY_MAX}
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <input
                      value={row.value}
                      onChange={(e) => setRow(i, { value: e.target.value })}
                      placeholder="e.g., Session-based auth"
                      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                        valTooLong
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-primary/30 focus:border-primary/40"
                      }`}
                    />
                    <div className={`mt-1 text-xs ${valTooLong ? "text-red-600" : "text-slate-400"}`}>
                      {valLen}/{VALUE_MAX}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="p-2 rounded-lg text-danger hover:bg-danger/10"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-primary/80 px-2">
            <Info size={14} />
            <span>
              Keep it crisp: “Authentication → JWT”, “Media → S3”, “Maps → Google Maps”, “Email/SMS → Twilio”.
              Max {MAX_ITEMS} rows.
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            disabled={saving || loading || !canSave || !isDirty}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => load(true)}
            disabled={saving || loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            {resetting ? "Resetting..." : "Reset"}
          </button>

          <div className="ml-auto text-xs text-slate-500">
            {cleaned.length}/{MAX_ITEMS} used
          </div>
        </div>

        {loading && !resetting && !saving ? <p className="mt-3 text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="mt-3 text-sm" style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </section>
  );
}