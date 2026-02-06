import { API_BASE } from "@/lib/api";

async function getProfile(username: string) {
  const res = await fetch(`${API_BASE}/public/u/${username}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {

  const {username} = await params;

  const data = await getProfile(username);
  if (!data) return <div style={{ padding: 24 }}>User not found</div>;

  const { user, apps } = data;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>{user.displayName || user.username}</h1>
      {user.headline ? <p style={{ marginTop: 6, color: "#666" }}>{user.headline}</p> : null}

      <h2 style={{ marginTop: 20, fontSize: 18, fontWeight: 700 }}>Apps</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {apps.map((a: any) => (
          <a
            key={a._id}
            href={`/u/${user.username}/${a.slug}`}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontWeight: 700 }}>{a.name}</div>
            <div style={{ marginTop: 6, color: "#666" }}>{a.shortDescription || "—"}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
