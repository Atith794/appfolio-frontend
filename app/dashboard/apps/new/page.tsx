"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NewAppPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [platform, setPlatform] = useState<("ANDROID" | "IOS")[]>(["ANDROID"]);
  const [error, setError] = useState("");

  function togglePlatform(p: "ANDROID" | "IOS") {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, shortDescription, platform })
      });

      const createdId = (data as any).app?._id;
      router.replace(`/dashboard/apps/${createdId}`);
    } catch (e: any) {
      setError(e.message || "Failed to create app");
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Create New App</h1>

      <form onSubmit={handleCreate} style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <label>
          App name*
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Food Delivery App"
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>
          Short description
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Order snacks fast in your neighborhood..."
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <div>
          Platform
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={platform.includes("ANDROID")}
                onChange={() => togglePlatform("ANDROID")}
              />
              Android
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={platform.includes("IOS")}
                onChange={() => togglePlatform("IOS")}
              />
              iOS
            </label>
          </div>
          {platform.length === 0 ? (
            <div style={{ color: "crimson", marginTop: 6 }}>Select at least one platform</div>
          ) : null}
        </div>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}

        <button
          type="submit"
          disabled={platform.length === 0}
          style={{ padding: "10px 12px", border: "1px solid #111", borderRadius: 10 }}
        >
          Create App
        </button>
      </form>
    </main>
  );
}