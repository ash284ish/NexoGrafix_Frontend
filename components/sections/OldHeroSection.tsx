"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../ui/Container";
import { motion, type Variants } from "framer-motion";

export default function HeroSection() {
  const parent: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18, //  slower one-by-one
        delayChildren: 0.16,   //  slight delay before first item
      },
    },
  };

  const itemUp: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85, //  slower entry
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const float1: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const float2: Variants = {
    animate: {
      y: [0, 12, 0],
      transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const float3: Variants = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
    },
  };


  return (
    <section className="relative overflow-hidden bg-[#FFF7ED]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-90 w-90 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -right-28 top-24 h-105 w-105 rounded-full bg-orange-300/35 blur-3xl" />
        <div className="absolute left-[35%] top-[60%] h-130 w-130 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

        <motion.div
          className="absolute left-[52%] top-10 hidden lg:flex"
          variants={float1}
          animate="animate"
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 7.8v8.4c0 .8.9 1.3 1.6.9l7.2-4.2c.7-.4.7-1.4 0-1.8L10.6 6.9C9.9 6.5 9 7 9 7.8Z"
              fill="#F97316"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-[54%] hidden lg:flex"
          variants={float2}
          animate="animate"
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.2 18.2 4.9 19a.9.9 0 0 1-1.2-1.1l.7-2.1A8 8 0 1 1 20 12a8 8 0 0 1-12.8 6.2Z"
              fill="#FDBA74"
            />
            <circle cx="9" cy="12" r="1.2" fill="#EA580C" />
            <circle cx="12" cy="12" r="1.2" fill="#EA580C" />
            <circle cx="15" cy="12" r="1.2" fill="#EA580C" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute right-28 top-40 hidden h-12 w-12 rounded-full bg-orange-400/70 lg:block"
          variants={float3}
          animate="animate"
        />

        <motion.div
          className="absolute left-10 top-8 hidden rotate-12 lg:block"
          variants={float2}
          animate="animate"
        >
          <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none">
            <path
              d="M12 46c10-18 30-26 40-10"
              stroke="#F97316"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      </div>

      <Container>
        <motion.div
          className="grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20"
          variants={parent}
          initial="hidden"
          animate="show"
        >
          <div className="text-left">
            <motion.div variants={itemUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-900">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                EXECUTION-FIRST AI PLATFORMS
              </div>
            </motion.div>

            <motion.h1
              variants={itemUp}
              className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-4xl"
            >
              We design and deliver
              <br className="hidden sm:block" />
              intelligent systems for publishing &amp; assessments.
            </motion.h1>


            <motion.p
              variants={itemUp}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg"
            >
              Nexografix delivers technology-enabled solutions across AI automation tools, publishing workflows,
              academic content production, assessment design, and enterprise operations — with structured execution
              and quality standards.
            </motion.p>

            <motion.div
              variants={itemUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_16px_44px_rgba(234,88,12,0.28)] hover:ring-orange-600/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 active:translate-y-0 sm:w-auto"
              >
                <span className="text-white">Book Demo</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h12M13 6l6 6-6 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/solutions"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_26px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/25 active:translate-y-0 sm:w-auto"
              >
                <span>Explore Solutions</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-500">
                  <path
                    d="M5 12h12M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>

            <motion.div variants={itemUp} className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                ✓
              </span>
              Enterprise delivery standards
            </motion.div>
          </div>


          <motion.div
            variants={float1}
            animate="animate"
            className="relative mx-auto w-full max-w-225 lg:max-w-270"
          >
            <div className="relative w-full h-80 sm:h-105 lg:h-130 overflow-visible">
              <Image
                src="/images/home_assets.png"
                alt="Nexografix preview"
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 1080px"
                className="object-contain"
              />
            </div>
          </motion.div>



        </motion.div>
      </Container>
    </section>
  );
}
