import Image from "next/image";
import { site } from "@/content/site";
import { ResumeLink } from "./ResumeLink";
import { BeachCaption } from "./water/BeachCaption";
import { BeachScene } from "./water/BeachScene";
import { BeachLive, BeachProvider, BeachSwitcher } from "./water/BeachControl";
import { WaterCanvasLoader } from "./water/WaterCanvasLoader";

export function Hero() {
  const resumeIsPlaceholder = site.resume.href === "#";

  return (
    <section className="hero" aria-labelledby="home-title">
      <div>
        <div className="hero-id">
          <Image
            src={site.photo.src}
            alt={site.photo.alt}
            width={site.photo.width}
            height={site.photo.height}
            sizes="(min-width: 768px) 72px, 56px"
            className="hero-photo"
            priority
            fetchPriority="high"
          />
          <h1 id="home-title">{site.name}</h1>
        </div>
        <p className="role">{site.role}</p>
        <p className="lede">{site.summary}</p>
        <div className="text-links">
          <ResumeLink href={site.resume.href} placeholder={resumeIsPlaceholder}>
            {site.resume.label}
          </ResumeLink>
          <a href="#contact">{site.contactCta}</a>
        </div>
      </div>
      <BeachProvider>
        <div className="heroviz">
          <div className="playground">
            <div className="playground-bar">
              <span className="playground-hints" aria-hidden="true">
                <span className="hint-coarse">Tap to make ripples</span>
                <span className="hint-fine">Move or click for ripples</span>
              </span>
              <BeachCaption />
              <BeachLive />
            </div>
            <WaterCanvasLoader />
            <BeachScene />
          </div>
          <BeachSwitcher />
        </div>
      </BeachProvider>
    </section>
  );
}
