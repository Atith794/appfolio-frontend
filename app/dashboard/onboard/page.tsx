"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type MeResponse =
  | { onboarded: false }
  | { onboarded: true; user: any };

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
          cache: "no-store"
        })) as MeResponse;

        if ("onboarded" in me && me.onboarded) {
          router.replace("/dashboard/apps");
          return;
        }
      } catch {
        // If /users/me returns 404 onboarded:false, apiFetch throws only on non-2xx.
        // We'll treat errors as "not onboarded" for now.
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          username,
          displayName,
          headline
        })
      });

      router.replace("/dashboard/apps");
    } catch (err: any) {
      setError(err.message || "Failed to onboard");
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Create your profile</h1>
      <p style={{ marginTop: 6, color: "#666" }}>
        This username becomes your public URL: <code>/u/username</code>
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <label>
          Username*
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="atith"
            required
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email hako lo"
            required
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Atith N"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>
          Headline
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="MERN | React Native Developer"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

        <button
          type="submit"
          style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}
        >
          Continue
        </button>
      </form>
    </main>
  );
}