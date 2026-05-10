import { LandingHeader } from "./LandingHeader";
import { LandingHero } from "./LandingHero";
import { LandingFooter } from "./LandingFooter";

export default function Landing() {
  return (
    <div className="bg-white text-slate-900 selection:bg-indigo-100 min-h-screen flex flex-col relative overflow-hidden">
      <LandingHeader />
      
      <main className="flex-1 pt-24">
        <LandingHero />
      </main>

      <LandingFooter />
    </div>
  );
}