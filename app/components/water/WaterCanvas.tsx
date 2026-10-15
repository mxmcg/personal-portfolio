"use client";

import { useEffect, useRef, useState } from "react";
import { createWaterEngine, type WaterEngine } from "./createWaterEngine";
import { WaterPoster } from "./WaterPoster";

function normalizedPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1;
  const height = rect.height || 1;
  return {
    x: (clientX - rect.left) / width,
    y: (clientY - rect.top) / height,
  };
}

export function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WaterEngine | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createWaterEngine(canvas, reducedMotion);
    engineRef.current = engine;
    let visible = true;

    const sync = () => {
      if (reducedMotion || !visible || document.hidden) {
        engine.stop();
        engine.render();
        return;
      }
      engine.start();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    intersection.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const themeObserver = new MutationObserver(() => {
      if (reducedMotion || document.hidden || !visible) engine.render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    sync();

    return () => {
      intersection.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, [reducedMotion]);

  const dropAt = (
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    amount: number
  ) => {
    if (reducedMotion) return;
    const point = normalizedPoint(canvas, clientX, clientY);
    engineRef.current?.addDrop(point.x, point.y, amount);
    lastPoint.current = point;
  };

  return (
    <div className="water-stage">
      <WaterPoster />
      <canvas
        ref={canvasRef}
        className="water-canvas"
        tabIndex={reducedMotion ? -1 : 0}
        aria-label={
          reducedMotion
            ? "Illustrated water"
            : "Illustrated water. Press Enter to make a ripple."
        }
        onPointerDown={(event) => {
          const small = event.currentTarget.clientWidth < 640;
          dropAt(
            event.currentTarget,
            event.clientX,
            event.clientY,
            small ? 0.28 : 0.45
          );
        }}
        onPointerMove={(event) => {
          if (reducedMotion) return;
          const canvas = event.currentTarget;
          const point = normalizedPoint(canvas, event.clientX, event.clientY);
          const small = canvas.clientWidth < 640;
          const last = lastPoint.current;
          const minDistance = small ? 0.05 : 0.012;
          if (
            last &&
            Math.hypot(point.x - last.x, point.y - last.y) < minDistance
          ) {
            return;
          }
          const amount = small
            ? 0.06
            : event.pointerType === "touch"
              ? 0.16
              : 0.1;
          dropAt(canvas, event.clientX, event.clientY, amount);
        }}
        onPointerLeave={() => {
          lastPoint.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          const small = event.currentTarget.clientWidth < 640;
          engineRef.current?.addDrop(0.7, 0.62, small ? 0.28 : 0.45);
        }}
      />
    </div>
  );
}
