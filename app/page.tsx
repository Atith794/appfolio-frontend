import Logo from "@/components/Logo";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UserCheck, SquareChartGantt, Presentation, Link, LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-charcoal/80 backdrop-blur-xl px-6 md:px-12 py-4">
        <div className="relative flex items-center justify-center md:justify-between max-w-[1440px] mx-auto">          <div className="flex justify-center items-center gap-4">
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 font-mono">
              APF
            </div>
            <h2 className="text-black text-xl font-black tracking-tight font-serif">AppFolio</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-8">
              <SignedIn>
                <button className="flex items-center justify-center rounded-lg h-10 px-6 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all font-serif cursor-pointer"><a href="/pricing">Pricing</a></button>
                {/* <a className="text-primary hover:text-white text-sm font-semibold transition-colors" href="/pricing">Pricing</a> */}
                <div className="h-6 w-px bg-white/10 mx-2"></div>
              </SignedIn>
            </nav>
            <div className="flex gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center justify-center rounded-lg h-10 px-6 text-violet-600 text-sm font-bold transition-all hover:bg-primary hover:text-white cursor-pointer font-serif">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-white/20 hover:text-primary transition-all cursor-pointer font-serif">Register</button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                  <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-white/20 hover:text-primary transition-all font-serif cursor-pointer"><a href="/dashboard">Go to Dashboard</a></button>
                  <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative px-6 md:px-12 lg:px-20 py-2 lg:py-5 overflow-hidden max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8 text-left relative z-10">
              {/* Hero Text */}
              {/* <h1 className="text-black text-5xl md:text-7xl font-black leading-[1.05] tracking-tight"> */}
              <h1 className="text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                Showcase your mobile app <br/><span className="text-primary">like a real product.</span>
              </h1>
              {/* <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-[540px]"> */}
              <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-[540px]">
                  Appfolio helps mobile app developers present their mobile apps with screens, flows, architecture, and decisions — all in one professional, shareable page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-sm sm:text-base md:text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all">Create your Appfolio</button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-sm sm:text-base md:text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"><a href="/dashboard">Go to Dashboard</a></button>
              </SignedIn>
              <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-black/80 border border-white/10 text-white text-sm sm:text-base md:text-lg font-bold hover:bg-white/10 transition-all hover:text-primary">
                <span><a href="/u/ati">View Example</a></span>
              </button>
            </div>
            </div>
            {/* Empty miniature mock screen */}
            <div className="relative hidden lg:block">
              <div className="dashboard-ui-preview rounded-2xl p-4 md:p-6 w-full aspect-video flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex gap-2">
                    <div className="size-3 rounded-full bg-red-500/40"></div>
                    <div className="size-3 rounded-full bg-yellow-500/40"></div>
                    <div className="size-3 rounded-full bg-green-500/40"></div>
                  </div>
                    <div className="h-6 w-1/3 bg-white/5 rounded-full"></div>
                </div>
                <div className="flex gap-6 h-full">
                  <div className="w-1/4 flex flex-col gap-3">
                    <div className="h-8 w-full bg-primary/20 rounded-lg"></div>
                    <div className="h-8 w-full bg-white/5 rounded-lg"></div>
                    <div className="h-8 w-full bg-white/5 rounded-lg"></div>
                    <div className="h-8 w-full bg-white/5 rounded-lg"></div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/20">+</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                        <div className="h-24 w-full bg-white/10 rounded-lg"></div>
                        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 size-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
              <div className="absolute -bottom-10 -left-10 size-64 bg-accent/20 rounded-full blur-[100px] -z-10"></div>
            </div>
          </div>
        </section>
        <section className="bg-charcoal px-6 md:px-12 lg:px-20 pt-24 border-y border-white/5">
          <div>
            <h1 className="text-black text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight font-mono">
              Your app deserves more than just <span className="text-primary">screenshots and repos</span>
            </h1>
          </div>
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="flex flex-col gap-3">
            </div>
            {/* <div className="flex bg-slatePanel p-1 rounded-xl border border-white/5">
            <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg">All</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">Designers</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">Developers</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">Creative</button>
            </div> */}
            </div>
            <h1 className="text-primary text-3xl md:text-4xl font-black leading-tight tracking-tight font-serif">What Appfolio Does?</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
              <div className="group bg-slatePanel rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/50 transition-all duration-300">
                <div className="aspect-[16/10] overflow-hidden bg-white/5 relative flex items-center justify-center">
                  <UserCheck
                    className="w-48 h-48 text-black/80 group-hover:scale-110 transition-transform duration-500" 
                    strokeWidth={1.5}
                  />
                  {/* Hover styles */}
                  {/* <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">View Details</button>
                  </div> */}
                  </div>
                  <div className="p-5 flex flex-col gap-1">
                  <p className="text-black text-base font-bold font-serif">Helps you build a professional app-portfolio</p>
                  <p className="text-gray-500 text-xs font-mono">Perfect for job seekers</p>
                </div>
              </div>
              <div className="group bg-slatePanel rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/50 transition-all duration-300">
                <div className="aspect-[16/10] overflow-hidden bg-white/5 relative flex items-center justify-center">
                  <SquareChartGantt 
                    className="w-48 h-48 text-black/80 group-hover:scale-110 transition-transform duration-500" 
                    strokeWidth={1.5}
                  />
                  {/* Hover styles */}
                  {/* <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <p className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">View Details</p>
                  </div> */}
                  </div>
                  <div className="p-5 flex flex-col gap-1">
                    <p className="text-black text-base font-bold font-serif">Turns your app into a product case study</p>
                    <p className="text-gray-500 text-xs font-mono">Perfect for pitching your app</p>
                  </div>
              </div>
              <div className="group bg-slatePanel rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/50 transition-all duration-300">
                <div className="aspect-[16/10] overflow-hidden bg-white/5 relative flex items-center justify-center">
                  <Link  
                    className="w-48 h-48 text-black/80 group-hover:scale-110 transition-transform duration-500" 
                    strokeWidth={1.5}
                  />
                  {/* Hover styles */}
                  {/* <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">View Details</button>
                  </div> */}
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <p className="text-black text-base font-bold font-serif">Helps create shareable links to share your app-craft</p>
                  <p className="text-gray-500 text-xs font-mono">Best platform to showcase your apps among your network</p>
                </div>
              </div>
              <div className="group bg-slatePanel rounded-xl overflow-hidden border border-white/5 flex flex-col hover:border-primary/50 transition-all duration-300">
                <div className="aspect-16/10 overflow-hidden bg-white/5 relative flex items-center justify-center">
                  {/* <img alt="Professional Resume" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaznqZ8KWCpJAkYrCrAywZLMQbiKPn0lIfPCARC9fS_vk8xhSTwJ4h055FySVSJWN7vZ8KKrIQHmoSPhnsgNIEwZZE6OebjWScdw8kTusLAa1d8lSfJfRdYWT97cOe1m8vjVqRVMLHgvL1-qyE-VggrfwEcvaXRe4laKEz_OsIz50qBUIJejk7TYo1i6QNvLyh-UJSomsY7K7L81lWoXC36tCr1-LEI3-KCngotrfAVQQ-bhTuwStggEhF8CcrXqpHE-vCU9dXbnJL"/> */}
                  <LayoutDashboard 
                    className="w-48 h-48 text-black/80 group-hover:scale-110 transition-transform duration-500" 
                    strokeWidth={1.5}
                  />
                  {/* <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300">View Details</button>
                </div> */}
                </div>
                <div className="p-5 flex flex-col gap-1">
                  <p className="text-black text-base font-bold font-serif">Group screens by onboarding, features, and edge cases</p>
                  <p className="text-gray-500 text-xs font-mono">Crafted for app developers</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5 px-6 md:px-12 lg:px-20 py-10 bg-charcoal">
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
      </footer>
    </div>
  );
}
