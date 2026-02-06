"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Info, Plus, Trash2 } from "lucide-react";

const MIN = 3;
const MAX = 5;
const MAX_LEN = 120;

export function AppOverviewPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [bullets, setBullets] = useState<string[]>(["", "", ""]);
  const [initial, setInitial] = useState<string[]>(["", "", ""]);

  const filledCount = useMemo(
    () => bullets.filter((b) => b.trim().length > 0).length,
    [bullets]
  );

  const canAdd = bullets.length < MAX;
  const canSave = filledCount >= MIN && filledCount <= MAX && !bullets.some((b) => b.trim().length > MAX_LEN);

  const isDirty = useMemo(() => {
    const norm = (arr: string[]) => arr.map((x) => x.trim());
    return JSON.stringify(norm(bullets)) !== JSON.stringify(norm(initial));
  }, [bullets, initial]);

  async function load(reset: Boolean) {
    setError("");
    setLoading(true);
    reset && setResetting(true); 
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const app = (data as any).app;
      const existing: string[] = Array.isArray(app?.overviewBullets) ? app.overviewBullets : [];

      // Ensure at least 3 inputs
      const next = [...existing.map((x) => String(x))];
      while (next.length < MIN) next.push("");

      // Cap at 5
      const capped = next.slice(0, MAX);

      setBullets(capped);
      setInitial(capped);
    } catch (e: any) {
      setError(e.message || "Failed to load app overview");
    } finally {
      setLoading(false);
      setResetting(false);
    }
  }

  useEffect(() => {
    load(false);
  }, [appId]);

  function setBullet(i: number, value: string) {
    setBullets((prev) => {
      const copy = [...prev];
      copy[i] = value;
      return copy;
    });
  }

  function addBullet() {
    if (!canAdd) return;
    setBullets((prev) => [...prev, ""]);
  }

  function removeBullet(index: number) {
    setBullets((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      while (copy.length < MIN) copy.push("");
      return copy.slice(0, MAX);
    });
  }

  async function save() {
    setError("");
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      const cleaned = bullets
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, MAX);

      await apiFetch(`/apps/${appId}/overview`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bullets: cleaned }),
      });

      alert("App overview saved!");
      await load(false);
    } catch (e: any) {
      setError(e.message || "Failed to save app overview");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800 font-serif">
              App overview (3–5 bullet points)
            </h3>
            <p className="text-sm text-slate-500">
              Keep it short. This is what recruiters will scan first.
            </p>
          </div>

          <button
            type="button"
            onClick={addBullet}
            disabled={!canAdd}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            title={canAdd ? "Add bullet" : "Max 5 bullets"}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {bullets.map((b, i) => {
            const len = b.trim().length;
            const tooLong = len > MAX_LEN;

            return (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-3 text-primary font-black">•</div>

                <div className="flex-1">
                  <textarea
                    value={b}
                    onChange={(e) => setBullet(i, e.target.value)}
                    placeholder={`Bullet ${i + 1} (max ${MAX_LEN} chars)`}
                    rows={2}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 ${
                      tooLong ? "border-red-300 focus:ring-red-200" : "border-slate-200"
                    }`}
                  />
                  <div className={`mt-1 text-xs ${tooLong ? "text-red-600" : "text-slate-400"}`}>
                    {len}/{MAX_LEN}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeBullet(i)}
                  className="mt-2 p-2 rounded-lg text-danger hover:bg-danger/10"
                  title="Remove bullet"
                  aria-label="Remove bullet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || loading || !canSave || !isDirty}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save overview"}
          </button>

          <button
            onClick={() => load(true)}
            disabled={saving || loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60 cursor-pointer"
          >
            {loading?'Resetting...':'Reset'}
          </button>

          <p className="hidden md:flex ml-auto items-center gap-1 text-xs font-medium text-primary/80">
            <Info size={14} />
            <span>
              You’ve filled {filledCount}/{MAX}. Minimum {MIN}.
            </span>
          </p>
        </div>

        {loading && !resetting && !saving ? <p className="mt-3 text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="mt-3 text-sm" style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </section>
  );
}