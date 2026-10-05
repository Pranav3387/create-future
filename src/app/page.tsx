import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { MaterialsLab } from "@/components/sections/MaterialsLab";
import { Process } from "@/components/sections/Process";
import { Configurator } from "@/components/sections/Configurator";
import { Trust } from "@/components/sections/Trust";
import { Testimonials } from "@/components/sections/Testimonials";
import { Coverage } from "@/components/sections/Coverage";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { Consultant } from "@/components/Consultant";
import { WhatsApp } from "@/components/WhatsApp";
import { CookieBanner } from "@/components/CookieBanner";
import { getProjects } from "@/content/projects";

export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Work projects={projects} />
        <BeforeAfter />
        <MaterialsLab />
        <Process />
        <Configurator />
        <Trust />
        <Testimonials />
        <Coverage />
        <Contact />
      </main>
      <Footer />
      <Consultant />
      <WhatsApp />
      <CookieBanner />
    </>
  );
}
