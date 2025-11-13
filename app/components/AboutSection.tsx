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
          I&apos;m a Senior Full Stack Engineer specializing in building web and mobile applications for
          Fortune 500 retail brands and global enterprises. I specialize in React, React Native, and headless
          CMS architectures—working on everything from e-commerce platforms to enterprise content systems.
        </motion.p>
        <motion.p variants={itemVariants}>
          For the past eight years, I&apos;ve worked in the digital agency space, bringing products and e-commerce
          projects to life for enterprise clients. My role extends well beyond engineering — I architect solutions,
          manage cross-functional teams, drive product decisions, and collaborate directly with stakeholders and
          clients.
        </motion.p>

        <motion.p variants={itemVariants}>
          Based in San Diego, where I enjoy the beach, traveling, and time with my wife.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="relative mx-auto max-w-[350px] lg:max-w-[380px]"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-2xl shadow-slate-900/50 ring-1 ring-teal-500/10 hover:ring-teal-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/profile.jpg"
              alt="Profile photo"
              width={400}
              height={500}
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
