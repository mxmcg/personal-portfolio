import { Sidebar } from "./components/Sidebar";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          {/* Left Column - Sidebar (Desktop: Sticky, Mobile/Tablet: Header) */}
          <aside className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-start lg:py-24">
            <div className="lg:pr-16">
              <Sidebar />
            </div>
          </aside>

          {/* Right Column - Scrollable Content */}
          <main className="pt-12 lg:w-1/2 lg:py-24">
            <div className="space-y-16 md:space-y-20 lg:space-y-24">
              <AboutSection />
              <ExperienceSection />
              <ProjectsSection />
              <ContactSection />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
