// "use client";

// import { useAuth } from "@clerk/nextjs";
// import { useState } from "react";

// export default function DashboardPage() {
//   const { getToken } = useAuth();
//   const [token, setToken] = useState<string>("");
//   const [meResp, setMeResp] = useState<string>("");

//   async function handleGetToken() {
//     try {
//       const t = await getToken();
//       // console.log("Token:",t);
//       setToken(t || "");
//     } catch (error) {
//       console.error("Token is not being fetched:",error)
//     }
//   }

//   async function handleCallMe() {
//     const t = await getToken();
//     if (!t) {
//       setMeResp("No token (are you logged in?)");
//       return;
//     }
//     const res = await fetch("http://localhost:4000/users/me", {
//       headers: { Authorization: `Bearer ${t}` },
//     });

//     const data = await res.json();
//     setMeResp(JSON.stringify(data, null, 2));
//   }

//   return (
//     <main style={{ padding: 24 }}>
//       <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard (Auth Test)</h1>

//       <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
//         <button onClick={handleGetToken} style={{ padding: "8px 12px", border: "1px solid #ccc" }}>
//           Get Token
//         </button>

//         <button onClick={handleCallMe} style={{ padding: "8px 12px", border: "1px solid #ccc" }}>
//           Call GET /users/me
//         </button>
//       </div>

//       <h2 style={{ marginTop: 16, fontWeight: 600 }}>Token</h2>
//       <textarea
//         value={token}
//         readOnly
//         style={{ width: "100%", height: 140, marginTop: 8 }}
//       />

//       <h2 style={{ marginTop: 16, fontWeight: 600 }}>API Response</h2>
//       <pre style={{ background: "#f6f6f6", padding: 12, marginTop: 8, overflow: "auto" }}>
//         {meResp}
//       </pre>
//     </main>
//   );
// }
import { redirect } from "next/navigation";

export default function DashboardRoot() {
  redirect("/dashboard/onboard");
}