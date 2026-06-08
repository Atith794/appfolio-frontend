// import { API_BASE } from "@/lib/api";

// async function getProfile(username: string) {
//   const res = await fetch(`${API_BASE}/public/u/${username}`, { cache: "no-store" });
//   if (!res.ok) return null;
//   return res.json();
// }

// export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {

//   const {username} = await params;

//   const data = await getProfile(username);
//   if (!data) return <div style={{ padding: 24 }}>User not found</div>;

//   const { user, apps } = data;

//   return (
//     <main style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 26, fontWeight: 800 }}>{user.displayName || user.username}</h1>
//       {user.headline ? <p style={{ marginTop: 6, color: "#666" }}>{user.headline}</p> : null}

//       <h2 style={{ marginTop: 20, fontSize: 18, fontWeight: 700 }}>Apps</h2>

//       <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
//         {apps.map((a: any) => (
//           <a
//             key={a._id}
//             href={`/u/${user.username}/${a.slug}`}
//             style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, textDecoration: "none", color: "inherit" }}
//           >
//             <div style={{ fontWeight: 700 }}>{a.name}</div>
//             <div style={{ marginTop: 6, color: "#666" }}>{a.shortDescription || "—"}</div>
//           </a>
//         ))}
//       </div>
//     </main>
//   );
// }

import Link from "next/link";
import { API_BASE } from "@/lib/api";
import {
  AppWindow,
  ArrowUpRight,
  Hash,
  Info,
  UserRound,
} from "lucide-react";

async function getProfile(username: string) {
  const res = await fetch(`${API_BASE}/public/u/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const data = await getProfile(username);

  if (!data) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 text-black">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-serif text-xl font-black text-slate-900">
                User not found
              </h1>
              <p className="mt-1 font-serif text-sm text-slate-500">
                The profile you are looking for does not exist or is no longer
                available.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { user } = data;
  const apps = Array.isArray(data?.apps) ? data.apps : [];

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        {/* Profile header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary md:size-14">
                <UserRound className="h-6 w-6 md:h-7 md:w-7" />
              </div>

              <div>
                <p className="mb-1 font-serif text-sm font-medium text-slate-500">
                  Public Profile
                </p>

                <h1 className="font-serif text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                  {user.displayName || user.username}
                </h1>

                <p className="mt-2 font-mono text-xs text-slate-500">
                  @{user.username}
                </p>

                {user.headline ? (
                  <p className="mt-4 max-w-2xl font-serif text-sm leading-6 text-slate-600 md:text-base">
                    {user.headline}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="font-serif text-xs text-slate-500">Total apps</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary">
                {apps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Apps heading */}
        <div className="mt-8">
          <h2 className="font-serif text-xl font-black tracking-tight text-black">
            Apps
          </h2>

          <p className="mt-1 font-serif text-sm text-slate-500">
            Explore the apps and projects shared by this user.
          </p>
        </div>

        {/* Apps list */}
        <div className="mt-5 grid gap-4">
          {apps.map((a: any) => (
            <Link
              key={a._id}
              href={`/u/${user.username}/${a.slug}`}
              className="group rounded-xl border-2 border-dashed border-primary/50 bg-white p-4 transition-all hover:border-primary hover:bg-primary/5 md:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <AppWindow className="h-4 w-4 shrink-0 text-primary" />

                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {a.name}
                    </h3>
                  </div>

                  <p className="mt-3 line-clamp-2 font-serif text-sm leading-6 text-slate-600">
                    {a.shortDescription || "No description added."}
                  </p>

                  <div className="mt-4 flex items-center gap-3 font-mono text-xs text-slate-500">
                    <Hash className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-all">{a.slug}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-serif text-sm font-medium text-primary/90 transition group-hover:bg-primary/20">
                  <span>View app</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}

          {apps.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white text-slate-400">
                <AppWindow className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-serif text-base font-bold text-slate-800">
                No apps published yet
              </h3>

              <p className="mt-2 font-serif text-sm text-slate-500">
                This user has not added any public apps to their profile.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}