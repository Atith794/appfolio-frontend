// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";

// type MeResponse =
//   | { onboarded: false }
//   | { onboarded: true; user: any };

// export default function OnboardPage() {
//   const { getToken } = useAuth();
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [headline, setHeadline] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = await getToken();
//         if (!token) return;

//         const me = (await apiFetch("/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store"
//         })) as MeResponse;

//         if ("onboarded" in me && me.onboarded) {
//           router.replace("/dashboard/apps");
//           return;
//         }
//       } catch {
//         // If /users/me returns 404 onboarded:false, apiFetch throws only on non-2xx.
//         // We'll treat errors as "not onboarded" for now.
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [getToken, router]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     try {
//       const token = await getToken();
//       if (!token) {
//         setError("Not authenticated.");
//         return;
//       }

//       await apiFetch("/users/onboard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           email,
//           username,
//           displayName,
//           headline
//         })
//       });

//       router.replace("/dashboard/apps");
//     } catch (err: any) {
//       setError(err.message || "Failed to onboard");
//     }
//   }

//   if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

//   return (
//     <main style={{ padding: 24, maxWidth: 520 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700 }}>Create your profile</h1>
//       <p style={{ marginTop: 6, color: "#666" }}>
//         This username becomes your public URL: <code>/u/username</code>
//       </p>

//       <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 10 }}>
//         <label>
//           Username*
//           <input
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="atith"
//             required
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         <label>
//           Email
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email hako lo"
//             required
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         <label>
//           Display name
//           <input
//             value={displayName}
//             onChange={(e) => setDisplayName(e.target.value)}
//             placeholder="Atith N"
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         <label>
//           Headline
//           <input
//             value={headline}
//             onChange={(e) => setHeadline(e.target.value)}
//             placeholder="MERN | React Native Developer"
//             style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
//           />
//         </label>

//         {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

//         <button
//           type="submit"
//           style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}
//         >
//           Continue
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type MeResponse = { onboarded: false } | { onboarded: true; user: any };

export default function OnboardPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const me = (await apiFetch("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })) as MeResponse;

        // if ("onboarded" in me && me.onboarded) {
        //   router.replace("/dashboard/apps");
        //   return;
        // }
        if (me.onboarded) {
          router.replace("/dashboard/apps");
          return;
        }

        setLoading(false);
      } catch (err) {
        // Treat errors as "not onboarded" for now.
        console.error("Failed to check onboarding status:", err);
        setError("Failed to check onboarding status.");
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        setError("Not authenticated.");
        return;
      }

      await apiFetch("/users/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          username,
          displayName,
          headline,
        }),
      });

      router.replace("/dashboard/apps");
    } catch (err: any) {
      setError(err.message || "Failed to onboard");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-3 py-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm font-medium text-primary/90">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-3 py-6">
      <section className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-5">
          {/* <p className="mb-2 inline-block rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary/90">
            Welcome to AppFolio
          </p> */}

          <h1 className="text-2xl font-black tracking-tight text-black font-serif">
            Create your profile
          </h1>
        </div>

        <hr className="my-6 border-t-3 border-dotted border-primary/50" />

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Username <span className="text-primary">*</span>
              </label>
              <p className="mt-2 text-sm text-slate-600">
                This username becomes your public portfolio URL:{" "}
                <code className="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary">
                  /u/username
                </code>
              </p>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your user name"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />
              <p className="mt-1 text-xs text-slate-500">
                Keep it simple. This will be used in your public URL.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Email <span className="text-primary">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Please enter the email associated with the app"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Creator of the app
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Please enter the name of the creator of the app"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black">
                Headline
              </label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Add a short headline about the creator. Ex: MERN | React native developer"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 text-black"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 hover:cursor-pointer"
            >
              Create Profile
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
