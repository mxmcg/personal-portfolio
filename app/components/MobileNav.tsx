"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/content/site";

export function MobileNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const current = visible.sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio
        )[0];
        setActive(`#${current.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="mnav" aria-label="Sections">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={active === item.href ? "true" : undefined}
        >
          {item.shortLabel}
        </a>
      ))}
    </nav>
  );
}
