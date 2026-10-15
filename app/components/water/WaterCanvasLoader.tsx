"use client";

import dynamic from "next/dynamic";
import { WaterPoster } from "./WaterPoster";

const WaterCanvas = dynamic(
  () => import("./WaterCanvas").then((mod) => mod.WaterCanvas),
  {
    ssr: false,
    loading: () => <WaterPoster labelled />,
  }
);

export function WaterCanvasLoader() {
  return <WaterCanvas />;
}
