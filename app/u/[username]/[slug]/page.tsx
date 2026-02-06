import { API_BASE } from "@/lib/api";

async function getApp(username: string, slug: string) {
  console.log("Username:",username)
  console.log("Slug:",slug)
  console.log("URL that we are hitting:",`${API_BASE}/public/u/${username}/${slug}`);
  const res = await fetch(`${API_BASE}/public/u/${username}/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicAppPage({
  params
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const data = await getApp(username, slug);
  if (!data) return <div style={{ padding: 24 }}>App not found</div>;

  const { user, app } = data;

  const screenshots = (app.screenshots || []).slice().sort((a: any, b: any) => a.order - b.order);
  const steps = (app.walkthrough || []).slice().sort((a: any, b: any) => a.order - b.order);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <a href={`/u/${user.username}`} style={{ color: "#666", textDecoration: "none" }}>
        ← {user.displayName || user.username}
      </a>

      <h1 style={{ marginTop: 10, fontSize: 28, fontWeight: 900 }}>{app.name}</h1>
      {app.shortDescription ? <p style={{ marginTop: 8, color: "#555" }}>{app.shortDescription}</p> : null}

      {screenshots.length ? (
        <>
          <h2 style={{ marginTop: 20, fontSize: 18, fontWeight: 800 }}>Screenshots</h2>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {screenshots.map((s: any) => (
              <img key={s._id} src={s.url} alt="" style={{ width: "100%", borderRadius: 12, border: "1px solid #eee" }} />
            ))}
          </div>
        </>
      ) : null}

      <h2 style={{ marginTop: 24, fontSize: 18, fontWeight: 800 }}>Walkthrough</h2>
      {steps.length ? (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {steps.map((st: any) => (
            <div key={st._id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
              <div style={{ fontWeight: 800 }}>
                {st.order}. {st.title}
              </div>
              {st.description ? <div style={{ marginTop: 8, color: "#555" }}>{st.description}</div> : null}
              {st.imageUrl ? (
                <div style={{ marginTop: 10 }}>
                  <img src={st.imageUrl} alt="" style={{ width: "100%", maxWidth: 520, borderRadius: 12, border: "1px solid #eee" }} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: 10, color: "#666" }}>No walkthrough steps yet.</p>
      )}
    </main>
  );
}