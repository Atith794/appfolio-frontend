import { ScreenshotsPanel } from "@/components/ScreenshotsPanel";
import { WalkthroughPanel } from "@/components/WalkthroughPanel";
import { GenerateCoverButton } from "@/components/GenerateCoverButton";
import { AppHeroPanel } from "@/components/AppHeroPanel";
import { AppOverviewPanel } from "@/components/AppOverviewPanel";
import { ChallengesTradeoffsPanel } from "@/components/ChallengesTradeoffsPanel";
import { ArchitectureDiagramPanel } from "@/components/ArchitectureDiagramPanel";
import { UserFlowDiagramPanel } from "@/components/UserFlowDiagramPanel";
import { TechStackPanel } from "@/components/TechStackPanel";
import { IntegrationsPanel } from "@/components/IntegrationsPanel";
import { UserFlowWalkthroughsPanel } from "@/components/UserFlowWalkthroughsPanel";
import Link from 'next/link'

export default async function AppManagePage({ 
  params 
}: { 
  params: Promise<{ appId: string, username: string }> 
}) {
  const { appId } = await params;

  return (
    <main style={{ padding: 12 }}>
      {/* App Hero panel */}
       <Link 
          href={`/dashboard/apps/${appId}/preview/`}
          className="px-4 py-2 my-5 rounded-lg text-sm font-medium bg-primary/10 text-primary/90 hover:bg-primary/20 inline-block"
        >
          Preview
        </Link>
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        App Hero
      </h2>
        <AppHeroPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />

      {/* App overview panel */}
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        App Overview
      </h2>
        <AppOverviewPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      
      {/* Screenshots panel */}
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        Screenshots
      </h2>   
      <ScreenshotsPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        Tech Stack
      </h2>
      <TechStackPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        Integrations & Key Decisions
      </h2>
      <IntegrationsPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        Architecture Overview
      </h2>
        <ArchitectureDiagramPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        User Flow
      </h2>
        <UserFlowWalkthroughsPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      {/* <h2 className="text-black text-xl font-black tracking-tight font-serif">User Flow</h2>
        <UserFlowDiagramPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" /> */}

      {/* CHallenges and Tradeoffs panel */}
      <h2 className="text-black text-xl font-black tracking-tight font-serif">
        Challenges & Tradeoffs
      </h2>
        <ChallengesTradeoffsPanel appId={appId} />
      <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      


      {/* Dotted Divider */}
      {/* <hr className="border-t-3 border-dotted border-primary/50 my-8" />
      <WalkthroughPanel appId={appId} />

      <hr className="border-t-2 border-dotted border-slate-200 my-8" />
      <div style={{ marginTop: 20 }}>
        <GenerateCoverButton appId={appId} />
      </div> */}
    </main>
  );
}