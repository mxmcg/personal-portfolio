import { Sidebar } from "./components/Sidebar";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { SkipLink } from "./components/SkipLink";
import { MouseSpotlight } from "./components/MouseSpotlight";

export default function Home() {
  return (
    <div className="group/spotlight relative">
      <MouseSpotlight />
      <SkipLink />
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <Sidebar />
          <main id="main-content" className="pt-24 lg:w-1/2 lg:py-24">
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            <ContactSection />
          </main>
        </div>
      </div>
    </div>
  );
}
