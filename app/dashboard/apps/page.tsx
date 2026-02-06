"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AppWindow, Link as LinkIcon, Hash, PlusCircle, Copy, Check, Info, Search } from 'lucide-react';
import { redirect } from "next/navigation";
import { DescriptionWithMore } from "./Components/DescriptionWithMore";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_LINK || 'http://localhost:3000';

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

type AppItem = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  createdAt?: string;
};

export default function AppsPage() {
  const { getToken } = useAuth();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");

  const filteredApps = apps.filter((a) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    const name = (a.name || "").toLowerCase();
    const slug = (a.slug || "").toLowerCase();
    const desc = (a.shortDescription || "").toLowerCase();

    return name.includes(q) || slug.includes(q) || desc.includes(q);
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const data = await apiFetch("/apps", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store"
        });
        setApps((data as any).apps || []);
        setUsername((data as any).user.username);
      } catch (e: any) {
        setError(e.message || "Failed to load apps");
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  return (
    <main style={{ padding: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h2 className="text-black text-xl font-black tracking-tight font-serif">Dashboard</h2>    
        <p className="text-sm text-slate-500 mt-1 font-serif">
          Manage your app-portfolios
        </p>
      </div>

      <div className="mt-4">
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, slug, or description…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-[10px] sm:placeholder:text-xs"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500 font-mono">
          Showing {filteredApps.length} of {apps.length}
        </p>
      </div>

      {loading ? <p style={{ marginTop: 12 }}>Loading...</p> : null}
      {error ? <p style={{ marginTop: 12, color: "crimson" }}>{error}</p> : null}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {filteredApps.map((a) => (
           <div key={a._id} className='group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-[12px] md:p-[24px] lg:p-[24px] md:flex lg:flex items-center hover:border-primary/50 hover:bg-primary/5 transition-all'>
             <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                
                <div className="flex items-center gap-2">
                  <AppWindow className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-semibold text-slate-900 font-serif">
                    {a.name}
                  </h3>
                  
                </div>
                
                {a.shortDescription && (
                  <div className="flex items-start gap-2 text-sm text-slate-600 font-serif">
                    {/* <FileText className="w-4 h-4 mt-0.5 text-slate-400" /> */}
                    <span>{a.shortDescription && <DescriptionWithMore text={a.shortDescription} limit={90} />}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <Hash className="w-3.5 h-3.5" />
                  <span>{a.slug}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                  <a
                    href={`${API_BASE}/u/${username}/${a.slug}`}
                    target="_blank"
                    className="text-primary hover:underline break-all focus:outline-none"
                    aria-describedby={`visit-url-${a._id}`}
                  >
                    {API_BASE}/u/{username}/{a.slug}
                  </a>
                  <CopyLink url={`${API_BASE}/u/${username}/${a.slug}`} />
                  </div>
              </div>
             <div>
               <button 
                className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 cursor-pointer"
                onClick={() => {
                  return redirect(`/dashboard/apps/${a._id}`);
                }}
               >
                Manage
               </button>
             </div>
           </div>
        ))}

        {!loading && apps.length === 0 ? (
          <div style={{ marginTop: 8, color: "#666" }}>
            No apps yet. Create your first one.
          </div>
        ) : !loading && filteredApps.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500 font-serif">
            No results for <span className="font-mono text-slate-700">"{query}"</span>.
          </div>
        ) : null}
        {/* Add new app */}
        <div style={{ marginTop: 12 }}>
          <Link href="/dashboard/apps/new">
            <div className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-[24px] md:p-[48px] lg:p-[64px] flex items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* <PlusCircle size={48} /> */}
                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-primary dark:text-white font-serif">Add new app</p>
                <p className="text-sm sm:text-sm text-slate-500 dark:text-slate-400 font-serif">Create an App-portfolio</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
