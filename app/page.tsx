import { site, siteUrl } from "@/content/site";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MobileNav } from "./components/MobileNav";
import { Now } from "./components/Now";
import { Projects } from "./components/Projects";
import { Ridgeline } from "./components/Ridgeline";
import { SkipLink } from "./components/SkipLink";
import { ThemeToggle } from "./components/ThemeToggle";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: siteUrl,
  email: `mailto:${site.email}`,
  image: `${siteUrl}${site.photo.src}`,
  description: site.summary,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vista",
    addressRegion: "CA",
    addressCountry: "US",
  },
  sameAs: [site.linkedin.href],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SkipLink />
      <div className="bg-wash" aria-hidden="true" />
      <Ridgeline />
      <div className="wrap" id="top">
        <Header />
        <main id="content">
          <Hero />
          <MobileNav />
          <About />
          <Experience />
          <Projects />
          <Now />
          <Contact />
        </main>
        <Footer />
      </div>
      <ThemeToggle variant="fab" />
    </>
  );
}
