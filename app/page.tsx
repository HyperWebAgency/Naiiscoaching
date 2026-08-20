import { Hero } from "@/components/Hero";
import { LatestVlog } from "@/components/LatestVlog";
import { RevealBlur } from "@/components/RevealBlur";
import { Testimonials } from "@/components/Testimonials";
import { WhoAmI } from "@/components/WhoAmI";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <WhoAmI />
      <Testimonials />
      <RevealBlur targetId="qui-je-suis" />
      {/* Home only. On /contact it would sit on top of the fullscreen word
          sequence, which is the one place the page wants no competition. */}
      <LatestVlog />
    </main>
  );
}
