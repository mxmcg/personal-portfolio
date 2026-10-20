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
      <header className="lab-bar">
        <Link href="/" className="lab-back">
          <span aria-hidden="true">←</span> Home
        </Link>
        <ThemeToggle variant="nav" />
      </header>
      <figure className="lab-figure">
        <div className="lab-frame">
          <SurfLoop />
        </div>
        <figcaption className="lab-cap">Shipwrecks · Poipu, Kauai</figcaption>
      </figure>
    </main>
  );
}
