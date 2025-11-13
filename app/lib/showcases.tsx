import { ReactNode } from "react";
import OceanWaveSimulator from "../showcase-apps/ocean-wave-simulator";
import GPGPUWaterThreeJS from "../showcase-apps/gpgpu-water-threejs";
import OceanWavesGPGPU from "../showcase-apps/ocean-waves-gpgpu";

export interface Showcase {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  component: ReactNode;
  codeSnippet?: string;
}

export const showcases: Showcase[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    description: "A simple greeting component demonstrating basic text styling and theme support",
    tags: ["Typography", "Theme", "Basics"],
    component: (
      <div className="flex items-center justify-center p-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <h2 className="text-3xl font-bold text-foreground">
          Hello World!
        </h2>
      </div>
    ),
    codeSnippet: `<div className="flex items-center justify-center p-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
  <h2 className="text-3xl font-bold text-foreground">
    Hello World!
  </h2>
</div>`,
  },
  {
    slug: "ocean-wave-simulator",
    title: "Ocean Wave Simulator",
    description: "A WebGL ocean wave simulator with realistic shore-breaking physics. Swells travel from the horizon toward the beach, increasing in amplitude and creating dramatic white water breaks near shore. Features four wave profiles with smooth transitions.",
    tags: ["WebGL", "Three.js", "GLSL", "Shaders", "Physics"],
    component: <OceanWaveSimulator />,
  },
  {
    slug: "gpgpu-water",
    title: "GPGPU Water Simulation",
    description: "Interactive WebGL water simulation using GPU compute shaders via Three.js GPUComputationRenderer. Based on height-field wave equation with real-time ripple propagation. Click and drag to create realistic water disturbances. 128x128 resolution running at 60 FPS.",
    tags: ["WebGL", "Three.js", "GPGPU", "Compute Shaders", "Interactive", "Physics"],
    component: <GPGPUWaterThreeJS />,
  },
  {
    slug: "ocean-waves-gpgpu",
    title: "Shallow Water Wave Breaking",
    description: "Advanced GPU-accelerated shallow water simulation with realistic wave shoaling, breaking, and white water foam generation. Implements shallow water equations with bottom topography, directional wave propagation, and depth-dependent breaking criteria. Features dynamic foam advection and decay. Built with Three.js GPUComputationRenderer at 256x256 resolution.",
    tags: ["WebGL", "Three.js", "GPGPU", "Shallow Water", "Wave Breaking", "Foam", "CFD", "Physics"],
    component: <OceanWavesGPGPU />,
  },
  // Add more showcases here
];

export function getShowcaseBySlug(slug: string): Showcase | undefined {
  return showcases.find((showcase) => showcase.slug === slug);
}
