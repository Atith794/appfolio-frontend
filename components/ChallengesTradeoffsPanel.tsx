"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Info, Plus, Trash2 } from "lucide-react";

const BULLET_MIN = 2;
const BULLET_MAX = 8;
const BULLET_MAX_LEN = 160;
const INTRO_MAX_LEN = 600;

export function ChallengesTradeoffsPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [intro, setIntro] = useState("");
  const [bullets, setBullets] = useState<string[]>(["", ""]);

  const [initial, setInitial] = useState<{ intro: string; bullets: string[] }>({
    intro: "",
    bullets: ["", ""],
  });

  const filledCount = useMemo(
    () => bullets.filter((b) => b.trim().length > 0).length,
    [bullets]
  );

  const hasTooLongBullet = useMemo(
    () => bullets.some((b) => b.trim().length > BULLET_MAX_LEN),
    [bullets]
  );

  const introTooLong = intro.trim().length > INTRO_MAX_LEN;

  const canAdd = bullets.length < BULLET_MAX;

  const canSave =
    !introTooLong &&
    !hasTooLongBullet &&
    filledCount >= BULLET_MIN &&
    filledCount <= BULLET_MAX;

  const isDirty = useMemo(() => {
    const norm = (arr: string[]) => arr.map((x) => x.trim());
    return (
      intro.trim() !== initial.intro.trim() ||
      JSON.stringify(norm(bullets)) !== JSON.stringify(norm(initial.bullets))
    );
  }, [intro, bullets, initial]);

  async function load(resetting: Boolean) {
    setError("");
    setLoading(true);
    resetting && setResetting(true);
    try {
      const token = await getToken();
      if (!token) return;

      const data = await apiFetch(`/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const app = (data as any).app;

      const nextIntro = String(app?.challengesIntro || "");
      const existing: string[] = Array.isArray(app?.challengesBullets)
        ? app.challengesBullets
        : [];

      const nextBullets = [...existing.map((x) => String(x))];
      while (nextBullets.length < BULLET_MIN) nextBullets.push("");
      const capped = nextBullets.slice(0, BULLET_MAX);

      setIntro(nextIntro);
      setBullets(capped);

      setInitial({ intro: nextIntro, bullets: capped });
    } catch (e: any) {
      setError(e.message || "Failed to load challenges & tradeoffs");
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

  function removeBullet(i: number) {
    setBullets((prev) => {
      const copy = prev.filter((_, idx) => idx !== i);
      while (copy.length < BULLET_MIN) copy.push("");
      return copy.slice(0, BULLET_MAX);
    });
  }

  async function save() {
    setError("");
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      const cleanedBullets = bullets
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, BULLET_MAX);

      await apiFetch(`/apps/${appId}/challenges`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intro: intro.trim(),
          bullets: cleanedBullets,
        }),
      });

      alert("Challenges & tradeoffs saved!");
      await load(false);
    } catch (e: any) {
      setError(e.message || "Failed to save challenges & tradeoffs");
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
              Challenges & tradeoffs
            </h3>
            <p className="text-sm text-slate-500">
              Share the real engineering constraints, decisions, and what you’d improve next.
            </p>
          </div>

          <button
            type="button"
            onClick={addBullet}
            disabled={!canAdd}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            title={canAdd ? "Add bullet" : "Max bullets reached"}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Intro */}
        <div className="mt-4">
          <label 
            // className="text-sm font-semibold text-slate-700"
            className="text-sm font-semibold text-slate-800 font-serif"
          >Short intro (optional)</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Example: The biggest challenge was handling real-time updates while keeping the app fast on low-end devices..."
            rows={3}
            // className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 ${
            //   introTooLong ? "border-red-300 focus:ring-red-200" : "border-slate-200"
            // }`}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 ${
              introTooLong ? "border-red-300 focus:ring-red-200" : "border-slate-200"
            }`}
          />
          <div className={`mt-1 text-xs ${introTooLong ? "text-red-600" : "text-slate-400"}`}>
            {intro.trim().length}/{INTRO_MAX_LEN}
          </div>
        </div>

        {/* Bullets */}
        <div className="mt-4 grid gap-3">
          {bullets.map((b, i) => {
            const len = b.trim().length;
            const tooLong = len > BULLET_MAX_LEN;

            return (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-3 text-primary font-black">•</div>

                <div className="flex-1">
                  <textarea
                    value={b}
                    onChange={(e) => setBullet(i, e.target.value)}
                    placeholder={`Tradeoff / challenge ${i + 1} (max ${BULLET_MAX_LEN} chars)`}
                    rows={2}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 ${
                      tooLong ? "border-red-300 focus:ring-red-200" : "border-slate-200"
                    }`}
                  />
                  <div className={`mt-1 text-xs ${tooLong ? "text-red-600" : "text-slate-400"}`}>
                    {len}/{BULLET_MAX_LEN}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeBullet(i)}
                  className="mt-2 p-2 rounded-lg text-danger hover:bg-danger/10"
                  title="Remove"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || loading || !canSave || !isDirty}
            // className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save challenges"}
          </button>

          <button
            onClick={() => load(true)}
            disabled={saving || loading}
            // className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60 cursor-pointer"
          >
            {resetting ? 'Resetting...':'Reset'}
          </button>

          <p className="hidden md:flex ml-auto items-center gap-1 text-xs font-medium text-primary/80">
            <Info size={14} />
            <span>
              Filled {filledCount}/{BULLET_MAX}. Minimum {BULLET_MIN}.
            </span>
          </p>
        </div>

        {loading && !resetting && !saving ? <p className="mt-3 text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="mt-3 text-sm" style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </section>
  );
}