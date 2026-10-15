import { site } from "@/content/site";
import { ResumeLink } from "./ResumeLink";
import { WaterPoster } from "./water/WaterPoster";

export function Hero() {
  const resumeIsPlaceholder = site.resume.href === "#";

  return (
    <section className="hero" aria-labelledby="home-title">
      <div>
        <h1 id="home-title">{site.name}</h1>
        <p className="role">{site.role}</p>
        <p className="lede">{site.summary}</p>
        <div className="text-links">
          <ResumeLink href={site.resume.href} placeholder={resumeIsPlaceholder}>
            {site.resume.label}
          </ResumeLink>
          <a href="#contact">{site.contactCta}</a>
        </div>
      </div>
      <div className="playground">
        <div className="playground-bar" aria-hidden="true">
          <span className="hint-coarse">Tap to make ripples</span>
          <span className="hint-fine">Move or click for ripples</span>
        </div>
        <WaterPoster labelled />
      </div>
    </section>
  );
}
