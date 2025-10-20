import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <ProjectsGrid />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
