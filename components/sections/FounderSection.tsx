"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-slate-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-orange-200 bg-slate-50 shadow-2xl transition-all duration-700 hover:border-orange-400">
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]">
                <FiUser className="h-1/2 w-1/2 text-orange-600/80" />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-orange-200/50 blur-2xl" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-white/75 px-4 py-2 text-xs font-bold tracking-widest text-orange-700 uppercase">
              Meet Our Founder
            </div>
            
            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Ashish Anand
            </h2>
            
            <div className="mt-8 space-y-6">
              <p className="text-xl font-bold leading-relaxed text-slate-800">
                Founded by Ashish Anand — an entrepreneur focused on AI-driven content, 
                accessibility, publishing, and educational solutions.
              </p>
              
              <p className="text-lg leading-relaxed text-slate-600">
                Nexografix exists to help organizations create, transform, and deliver 
                high-quality digital content faster, more accurately, and more accessibly 
                through a combination of human expertise and intelligent technology.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-orange-200" />
              <div className="font-serif text-2xl italic text-slate-400">Ashish Anand</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
