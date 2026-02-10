"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { TECH_CATALOG, TechCategory, TechItem } from "@/lib/techCatalog";
import { Info, RotateCcw, Save, X, Search, Plus, Check } from "lucide-react";

const LIMITS: Record<TechCategory, number> = {
  frontend: 6,
  backend: 6,
  database: 3,
  infra: 6,
};

type TechStackState = Record<TechCategory, string[]>;

const EMPTY: TechStackState = {
  frontend: [],
  backend: [],
  database: [],
  infra: [],
};

function normalizeIds(arr: string[]) {
  return arr.map((x) => String(x).trim()).filter(Boolean);
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

function getItemById(id: string) {
  return TECH_CATALOG.find((t) => t.id === id);
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export function TechStackPanel({ appId }: { appId: string }) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");

  const [active, setActive] = useState<TechCategory>("frontend");
  const [query, setQuery] = useState("");

  const [stack, setStack] = useState<TechStackState>(EMPTY);
  const [initial, setInitial] = useState<TechStackState>(EMPTY);

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
      const ts = app?.techStack || {};

      const next: TechStackState = {
        frontend: uniq(normalizeIds(ts.frontend || [])).slice(0, LIMITS.frontend),
        backend: uniq(normalizeIds(ts.backend || [])).slice(0, LIMITS.backend),
        database: uniq(normalizeIds(ts.database || [])).slice(0, LIMITS.database),
        infra: uniq(normalizeIds(ts.infra || [])).slice(0, LIMITS.infra),
      };

      setStack(next);
      setInitial(next);
    } catch (e: any) {
      setError(e.message || "Failed to load tech stack");
    } finally {
      setLoading(false);
      setResetting(false);
    }
  }

  useEffect(() => {
    load(false);
  }, [appId]);

  const isDirty = useMemo(() => {
    return JSON.stringify(stack) !== JSON.stringify(initial);
  }, [stack, initial]);

  const selectedCount = useMemo(() => stack[active].length, [stack, active]);
  const limit = LIMITS[active];
  const limitReached = selectedCount >= limit;

  const catalogForActive = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TECH_CATALOG.filter((t) => t.category === active).filter((t) => {
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    });
  }, [active, query]);

  function addTech(item: TechItem) {
    setStack((prev) => {
      const current = prev[item.category];
      if (current.includes(item.id)) return prev;
      if (current.length >= LIMITS[item.category]) return prev;
      return { ...prev, [item.category]: [...current, item.id] };
    });
  }

  function removeTech(category: TechCategory, id: string) {
    setStack((prev) => ({ ...prev, [category]: prev[category].filter((x) => x !== id) }));
  }

  async function save() {
    try {
      setSaving(true);
      setError("");

      const token = await getToken();
      if (!token) return;

      await apiFetch(`/apps/${appId}/tech-stack`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(stack),
      });

      alert("Tech stack saved!");
      await load(false);
    } catch (e: any) {
      setError(e.message || "Failed to save tech stack");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800 font-serif">Tech Stack</h3>
            <p className="text-sm text-slate-500">
              Pick the technologies used to build this app. These icons will appear on your public Appfolio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving || loading || !isDirty}
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
          </div>
        </div>

        {/* Category tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(["frontend", "backend", "database", "infra"] as TechCategory[]).map((cat) => {
            const count = stack[cat].length;
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  isActive
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat === "frontend" ? "Frontend" : cat === "backend" ? "Backend" : cat === "database" ? "Database" : "Infra"}
                <span className="ml-2 text-xs font-bold text-slate-500">{count}/{LIMITS[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected chips */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">
              Selected ({selectedCount}/{limit})
            </p>

            <p className={`text-xs font-medium ${limitReached ? "text-red-600" : "text-slate-500"}`}>
              {limitReached ? "Limit reached" : "You can add more"}
            </p>
          </div>

          {stack[active].length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No tech selected yet for this category.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {stack[active].map((id) => {
                const item = getItemById(id);
                const name = item?.name ?? id;

                return (
                  <div
                    key={id}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    {item?.iconClass ? (
                    <div className="h-6 w-6 grid place-items-center rounded-md bg-white/80">
                      <i className={`${item.iconClass} colored text-lg dark:opacity-90`} />
                    </div>
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-slate-200 text-slate-700 text-xs font-bold grid place-items-center">
                        {initials(name)}
                      </div>
                    )}

                    <span className="text-sm font-medium text-slate-800">{name}</span>

                    <button
                      type="button"
                      onClick={() => removeTech(active, id)}
                      className="ml-1 p-1 rounded-md text-slate-500 hover:text-danger hover:bg-danger/10"
                      title="Remove"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search + pick list */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Add technologies</p>

            <div className="relative w-full max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tech…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {catalogForActive.map((item) => {
              const picked = stack[active].includes(item.id);
              const disabled = picked || (limitReached && !picked);

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => addTech(item)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                    picked
                      ? "border-primary/40 bg-primary/10"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                  title={picked ? "Already selected" : limitReached ? "Limit reached" : "Add"}
                >
                  {item.iconClass ? (
                    <div className="h-6 w-6 grid place-items-center rounded-md bg-white/90">
                        <i className={`${item.iconClass} colored text-xl dark:opacity-90`} />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold grid place-items-center">
                      {initials(item.name)}
                    </div>
                  )}
                    

                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.id}</div>
                  </div>

                  {picked ? (
                    <span className="text-xs font-bold text-primary"><Check /></span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500"><Plus /></span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-primary/80">
            <Info size={14} />
            <span>
              Tip: Keep it tight — recruiters scan this in 2 seconds. Frontend {LIMITS.frontend}, Backend{" "}
              {LIMITS.backend}, Database {LIMITS.database}, Infra {LIMITS.infra}.
            </span>
          </p>
        </div>

        {loading && !resetting && !saving ? (
          <p className="mt-3 text-sm text-slate-500">Loading...</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm" style={{ color: "crimson" }}>
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}