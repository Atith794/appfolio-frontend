// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { apiFetch } from "@/lib/api";

// export default function NewAppPage() {
//   const { getToken } = useAuth();
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [shortDescription, setShortDescription] = useState("");
//   const [platform, setPlatform] = useState<("ANDROID" | "IOS")[]>(["ANDROID"]);
//   const [error, setError] = useState("");

//   function togglePlatform(p: "ANDROID" | "IOS") {
//     setPlatform((prev) =>
//       prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
//     );
//   }

//   async function handleCreate(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     try {
//       const token = await getToken();
//       if (!token) {
//         setError("Not authenticated.");
//         return;
//       }

//       const data = await apiFetch("/apps", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ name, shortDescription, platform })
//       });

//       const createdId = (data as any).app?._id;
//       router.replace(`/dashboard/apps/${createdId}`);
//     } catch (e: any) {
//       setError(e.message || "Failed to create app");
//     }
//   }

//   return (
//     <main style={{ padding: 24, maxWidth: 560 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700 }}>Create New App</h1>

//       <form onSubmit={handleCreate} style={{ marginTop: 16, display: "grid", gap: 10 }}>
//         <label>
//           App name*
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="Food Delivery App"
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         <label>
//           Short description
//           <input
//             value={shortDescription}
//             onChange={(e) => setShortDescription(e.target.value)}
//             placeholder="Order snacks fast in your neighborhood..."
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         <div>
//           Platform
//           <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
//             <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={platform.includes("ANDROID")}
//                 onChange={() => togglePlatform("ANDROID")}
//               />
//               Android
//             </label>
//             <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
//               <input
//                 type="checkbox"
//                 checked={platform.includes("IOS")}
//                 onChange={() => togglePlatform("IOS")}
//               />
//               iOS
//             </label>
//           </div>
//           {platform.length === 0 ? (
//             <div style={{ color: "crimson", marginTop: 6 }}>Select at least one platform</div>
//           ) : null}
//         </div>

//         {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

//         <button
//           type="submit"
//           disabled={platform.length === 0}
//           style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}
//         >
//           Create App
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Platform = "ANDROID" | "IOS";

export default function NewAppPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [platform, setPlatform] = useState<Platform[]>(["ANDROID"]);
  const [error, setError] = useState("");

  function togglePlatform(p: Platform) {
    setPlatform((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        setError("Not authenticated.");
        return;
      }

      const data = await apiFetch("/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          shortDescription,
          platform,
        }),
      });

      const createdId = (data as any).app?._id;
      router.replace(`/dashboard/apps/${createdId}`);
    } catch (e: any) {
      setError(e.message || "Failed to create app");
    }
  }

  return (
    <main className="min-h-screen bg-white px-3 py-6">
      <section className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-5">
          {/* <p className="mb-2 inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary/90">
            New Portfolio Project
          </p> */}

          <h1 className="text-2xl font-black tracking-tight text-black font-serif">
            Create New App
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Add your app details first. You can later complete the hero,
            screenshots, tech stack, architecture, and case study sections.
          </p>
        </div>

        <hr className="my-6 border-t-3 border-dotted border-primary/50" />

        {/* Form Card */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                App name <span className="text-primary">*</span>
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Food Delivery App"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />

              <p className="mt-1 text-xs text-slate-500">
                This will be the main title of your app case study.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Short description
              </label>

              <input
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ex: Order snacks fast in your neighborhood..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />

              <p className="mt-1 text-xs text-slate-500">
                Keep it short. This appear in preview.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Platform <span className="text-primary">*</span>
              </label>

              <div className="flex flex-wrap gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    platform.includes("ANDROID")
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={platform.includes("ANDROID")}
                    onChange={() => togglePlatform("ANDROID")}
                    className="accent-primary"
                  />
                  Android
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    platform.includes("IOS")
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={platform.includes("IOS")}
                    onChange={() => togglePlatform("IOS")}
                    className="accent-primary"
                  />
                  iOS
                </label>
              </div>

              {platform.length === 0 ? (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  Select at least one platform.
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={platform.length === 0}
              className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 hover: cursor-pointer"
            >
              Create App
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}