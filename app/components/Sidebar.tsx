"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("about");
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <>
      {/* Mobile/Tablet Sticky Nav */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
          <nav className="px-6 py-4" aria-label="Sticky navigation">
            <ul className="flex gap-6 justify-center md:gap-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group relative flex items-center py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(item.id);
                      setClickedSection(item.id);
                      setTimeout(() => setClickedSection(null), 600);
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    <motion.span
                      className={`nav-text text-xs font-bold uppercase tracking-widest ${
                        activeSection === item.id
                          ? "text-slate-200"
                          : "text-slate-500 group-hover:text-slate-200"
                      }`}
                      initial={{ opacity: 0.6 }}
                      animate={{
                        opacity: activeSection === item.id ? 1 : 0.6,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                    {activeSection === item.id && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-300"
                        layoutId="stickyActiveTab"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      ></motion.span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Main Header Content */}
      <div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="lg:opacity-100"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl lg:leading-tight">
            <Link href="/">Max Example</Link>
          </h1>
          <h2 className="mt-2 text-lg font-medium tracking-tight text-slate-200 sm:text-xl lg:mt-1">
            Senior Front-End Engineer
          </h2>
          <p className="mt-4 max-w-xs leading-relaxed text-slate-400 lg:mt-3">
            I build accessible, pixel-perfect digital experiences for the web.
          </p>
        </motion.div>

        <nav className="nav mt-10 lg:mt-8" aria-label="In-page jump links">
          <ul className="flex gap-6 md:gap-8 lg:block">
            {navItems.map((item) => (
              <li key={item.id} className="lg:mb-0">
                <a
                  href={`#${item.id}`}
                  className="group relative flex items-center py-1.5 lg:py-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                    setClickedSection(item.id);
                    setTimeout(() => setClickedSection(null), 600);
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <div className="relative mr-4 hidden lg:block">
                    <motion.span
                      className={`block h-px ${
                        activeSection === item.id
                          ? "bg-slate-200"
                          : "bg-slate-600 group-hover:bg-slate-200 group-focus-visible:bg-slate-200"
                      }`}
                      initial={{ width: "2rem" }}
                      animate={{
                        width: activeSection === item.id ? "4rem" : "2rem",
                        scaleY: clickedSection === item.id ? [1, 2, 1] : 1,
                      }}
                      whileHover={{ width: "4rem" }}
                      transition={{
                        width: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        },
                        scaleY: {
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      }}
                    ></motion.span>
                    {clickedSection === item.id && (
                      <motion.span
                        className="absolute top-1/2 left-0 h-px bg-teal-300"
                        initial={{ width: "0%", opacity: 0.8, x: 0 }}
                        animate={{ width: "100%", opacity: 0, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ transform: "translateY(-50%)" }}
                      ></motion.span>
                    )}
                  </div>
                  <motion.span
                    className={`nav-text text-xs font-bold uppercase tracking-widest ${
                      activeSection === item.id
                        ? "text-slate-200"
                        : "text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200"
                    }`}
                    initial={{ opacity: 0.6 }}
                    animate={{
                      opacity: activeSection === item.id ? 1 : 0.6,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                  {/* Mobile/Tablet Active Indicator */}
                  {activeSection === item.id && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-300 lg:hidden"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    ></motion.span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
