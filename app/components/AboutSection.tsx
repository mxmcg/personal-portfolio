"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function AboutSection() {
  return (
    <section
      id="about"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="About me"
    >
      <motion.div
        className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          About
        </h2>
      </motion.div>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.p variants={itemVariants}>
          Back in 2016, I decided to try my hand at web development and tumbled
          head first into the rabbit hole of coding and web technologies. Fast
          forward to today, and I&apos;ve had the privilege of building software for
          a{" "}
          <a
            href="#"
            className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
          >
            startup
          </a>
          , an{" "}
          <a
            href="#"
            className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
          >
            agency
          </a>
          , and a{" "}
          <a
            href="#"
            className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
          >
            large corporation
          </a>
          .
        </motion.p>
        <motion.p variants={itemVariants}>
          My main focus these days is building accessible, inclusive products
          and digital experiences. I most enjoy building software in the sweet
          spot where design and engineering meet — things that look good but are
          also built well under the hood.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg"
        >
          <Image
            src="/profile.jpg"
            alt="Profile photo"
            width={400}
            height={500}
            className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
            priority
          />
        </motion.div>

        <motion.p variants={itemVariants}>
          When I&apos;m not at the computer, I&apos;m usually rock climbing, reading,
          hanging out with my family, or running after my two cats.
        </motion.p>
      </motion.div>
    </section>
  );
}
