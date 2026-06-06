import { UserButton } from "@clerk/nextjs";
import Logo from "@/components/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          height: 60,
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: '#fff'
        }}
      >
        <Logo />
        <UserButton afterSignOutUrl="/" />
      </header>

      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}