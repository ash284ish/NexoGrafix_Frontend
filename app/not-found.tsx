"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf7f2]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#ff7a1a]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#ffb37a]/20 blur-3xl" />
        <div className="absolute top-24 right-10 h-16 w-16 rounded-full bg-[#ff7a1a]/25 blur-xl" />
      </div>

      <motion.div
        className="pointer-events-none absolute left-[10%] top-[18%] h-10 w-10 rounded-full bg-[#ff7a1a]/25"
        animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] bottom-[18%] h-14 w-14 rounded-full bg-[#ff7a1a]/18"
        animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="w-full max-w-md text-center"
        >
          <motion.div variants={fadeUp}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff7a1a]" />
              Nexografix
            </div>

            <h1 className="mt-6 text-7xl font-extrabold tracking-tight text-slate-900">
              404
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              This page could not be found.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-md bg-[#ff7a1a] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#f26d10] focus:outline-none focus:ring-4 focus:ring-[#ff7a1a]/25"
            >
              Go to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
