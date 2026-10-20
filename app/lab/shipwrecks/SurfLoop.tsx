"use client";

import { useEffect, useState } from "react";

type Theme = "sunrise" | "sunset";

const loops: Record<Theme, { mp4: string; webm: string; jpg: string; webp: string }> = {
  sunrise: {
    mp4: "/lab/shipwrecks-sunrise.mp4",
    webm: "/lab/shipwrecks-sunrise.webm",
    jpg: "/lab/shipwrecks-sunrise.jpg",
    webp: "/lab/shipwrecks-sunrise.webp",
  },
  sunset: {
    mp4: "/lab/shipwrecks-sunset.mp4",
    webm: "/lab/shipwrecks-sunset.webm",
    jpg: "/lab/shipwrecks-sunset.jpg",
    webp: "/lab/shipwrecks-sunset.webp",
  },
};

const alt = "Painted surfer riding a peeling wave at Shipwrecks beach";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "sunset" ? "sunset" : "sunrise";
}

/**
 * Full-bleed surf loop that follows the Sunrise/Sunset theme.
 * Both posters render on the server and CSS shows the one for the current theme,
 * so the first paint is right before any script runs. The video mounts on the client
 * and is skipped entirely when reduced motion is requested.
 */
export function SurfLoop() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setTheme(readTheme());
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="lab-media">
      {(Object.keys(loops) as Theme[]).map((name) => (
        <picture key={name} className={`lab-poster show-in-${name}`}>
          <source srcSet={loops[name].webp} type="image/webp" />
          <img src={loops[name].jpg} alt={alt} width={1088} height={684} decoding="async" />
        </picture>
      ))}
      {theme && !reduced ? (
        <video
          key={theme}
          className="lab-video"
          ref={(el) => {
            if (!el) return;
            el.muted = true;
            el.play().catch(() => {
              /* Autoplay can be refused (for example in low power mode). The poster stays visible. */
            });
          }}
          poster={loops[theme].jpg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
        >
          <source src={loops[theme].webm} type="video/webm" />
          <source src={loops[theme].mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
