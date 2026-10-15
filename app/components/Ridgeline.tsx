"use client";

import { useEffect, useRef } from "react";

const LAYERS = [
  {
    id: "l1",
    depth: 0.02,
    d: "M0 220 L120 160 L230 200 L380 110 L520 180 L640 130 L800 190 L960 100 L1100 170 L1250 120 L1440 180 V400 H0Z",
  },
  {
    id: "l2",
    depth: 0.05,
    d: "M0 260 Q180 190 340 240 T680 220 Q860 170 1020 230 T1440 210 V400 H0Z",
  },
  {
    id: "l3",
    depth: 0.09,
    d: "M0 300 L160 250 L300 285 L470 230 L620 290 L790 245 L950 295 L1120 250 L1290 285 L1440 260 V400 H0Z",
  },
  {
    id: "l4",
    depth: 0.14,
    d: "M0 340 Q120 310 240 335 T480 330 T720 335 T960 328 T1200 336 T1440 330 V400 H0Z",
  },
] as const;

export function Ridgeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = LAYERS.map((layer) =>
      root.querySelector<SVGSVGElement>(`[data-layer="${layer.id}"]`)
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      layers.forEach((svg, index) => {
        if (!svg) return;
        const offset = (-y * LAYERS[index].depth).toFixed(1);
        svg.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ridge" ref={rootRef} aria-hidden="true">
      <svg className="ridge-grain">
        <filter id="ridge-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#ridge-grain)" />
      </svg>
      {LAYERS.map((layer) => (
        <svg
          key={layer.id}
          className={layer.id}
          data-layer={layer.id}
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path d={layer.d} />
        </svg>
      ))}
    </div>
  );
}
