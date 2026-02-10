import Hero from "@/components/Hero";
import GlassCard from "@/components/GlassCard";
import IntegrationNodes from "@/components/IntegrationNodes";
import { TrendingUp, Layers, Zap, Shield, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI Forecasting",
    desc: "Predictive models that transform historical volatility into prescriptive control.",
    delay: 0.1
  },
  {
    icon: Layers,
    title: "Data Synthesis",
    desc: "Unified intelligence layer connecting CRM, POS, and ERP data silos seamlessly.",
    delay: 0.2
  },
  {
    icon: Zap,
    title: "Kinetic Physics",
    desc: "Real-time data processing engine designed for high-frequency enterprise scale.",
    delay: 0.3
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between selection:bg-white/10">
      <Hero />

      {/* Narrative Section 1: Features */}
      <section className="w-full py-32 bg-mesh relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <GlassCard key={i} delay={f.delay}>
                <f.icon className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-display font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-white/50 leading-relaxed font-sans">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section 2: Infrastructure / Integration */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-display mb-4 block">Engineered Intelligence</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
              UNIFIED DATA<br />
              <span className="text-white/40 italic">ECOSYSTEM.</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 font-sans max-w-lg">
              Our Antigravity engine eliminates friction in data integration.
              Connect any source and watch the chaos align into actionable foresight.
            </p>

            <div className="space-y-6">
              {[
                { label: "End-to-End Encryption", icon: Shield },
                { label: "Real-time Analytics", icon: BarChart3 },
                { label: "Global Deployment", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80">
                  <div className="w-5 h-5 flex items-center justify-center border border-white/20 rounded-full">
                    <item.icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-sm font-display tracking-widest uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <IntegrationNodes />
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 blur-[120px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 blur-[120px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="w-full py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="font-display font-bold text-xl tracking-tighter">
            ISOMORPH <span className="text-white/40">AI</span>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-display text-white/40">
            <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-white transition-colors">Technology</a>
            <a href="#" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#" className="hover:text-white transition-colors">Access</a>
          </div>

          <div className="text-[10px] text-white/20 font-sans tracking-widest">
            © 2026 ANTIGRAVITY ENGINE. PREDICT CONTROL.
          </div>
        </div>
      </footer>
    </main>
  );
}
