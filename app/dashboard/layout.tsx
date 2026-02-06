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
      {/* <footer className="border-t border-white/5 px-6 md:px-12 lg:px-20 py-10 bg-charcoal">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
            <div className="col-span-2 flex flex-col gap-6">
              <Logo />
              <p className="text-gray-500 text-sm leading-relaxed max-w-[320px] font-mono">
                  Empowering creatives to showcase their unique stories and land life-changing opportunities through beautiful design.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-black font-bold text-sm font-serif">Product</h4>
              <nav className="flex flex-col gap-3">
                <a className="text-gray-500 text-sm hover:text-black transition-colors font-serif" href="/u/ati">See an example</a>
                <a className="text-gray-500 text-sm hover:text-black transition-colors font-serif" href="/pricing">See Pricing</a>
              </nav>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-black font-bold text-sm font-serif">Legal</h4>
              <nav className="flex flex-col gap-3">
                <a className="text-gray-500 text-sm hover:text-black transition-colors font-serif" href="#">Privacy</a>
                <a className="text-gray-500 text-sm hover:text-black transition-colors font-serif" href="#">Terms</a>
              </nav>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-gray-600 text-[10px] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif">© 2024 AppFolio Inc. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}