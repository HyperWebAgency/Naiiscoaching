import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LatestVlog } from "@/components/LatestVlog";
import { Services } from "@/components/Services";
import { RevealBlur } from "@/components/RevealBlur";
import { Testimonials } from "@/components/Testimonials";
import { WhoAmI } from "@/components/WhoAmI";

export default function Home() {
  return (
    <>
      <main className="relative">
        <Hero />
        <WhoAmI />
        <Testimonials />
        {/* After the proof, the offer: a visitor scrolls past the results and
            the avis before being asked to look at prices. This is also what
            the navbar's #services link points at — a dead anchor until now. */}
        <Services />
        <RevealBlur targetId="qui-je-suis" />
        {/* Home only. On /contact it would sit on top of the fullscreen word
            sequence, which is the one place the page wants no competition. */}
        <LatestVlog />
      </main>

      {/* Outside `main`, not inside it: `footer` is its own landmark, and
          nesting it would fold the site's contentinfo into the page's main
          content. Home only for the same reason as the vlog tab — /contact is a
          single full-height experience with no scroll past the form. */}
      <Footer />
    </>
  );
}
