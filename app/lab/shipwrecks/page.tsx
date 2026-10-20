import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { SurfLoop } from "./SurfLoop";

export const metadata: Metadata = {
  title: "Shipwrecks · lab",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ShipwrecksLab() {
  return (
    <main className="lab">
      <div className="lab-stage">
        <SurfLoop />
        <Link href="/" className="lab-back">
          <span aria-hidden="true">←</span> Home
        </Link>
        <p className="lab-cap">Shipwrecks · Poipu, Kauai</p>
        <div className="lab-tools">
          <ThemeToggle variant="nav" />
        </div>
      </div>
    </main>
  );
}
