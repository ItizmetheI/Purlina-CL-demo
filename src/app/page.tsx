import Experience from "@/components/Experience";
import ScrollManager from "@/components/ScrollManager";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import Sectors from "@/components/sections/Sectors";
import SectorShowcase from "@/components/sections/SectorShowcase";
import Cta from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <ScrollManager />
      <Experience />
      <Header />
      <ScrollProgress />
      <main className="relative z-10">
        <Hero />
        <Benefits />
        <Sectors />
        <SectorShowcase />
        <Cta />
      </main>
    </>
  );
}
