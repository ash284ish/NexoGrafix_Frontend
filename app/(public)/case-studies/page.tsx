"use client";

import { motion } from "framer-motion";
import { caseStudies } from "@/data/caseStudies";
import { FiArrowRight, FiCheckCircle, FiTarget, FiBox } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CaseStudiesPage() {
  return (
    <div className="bg-[#FFF7ED] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-white/75 px-4 py-2 text-xs font-semibold text-orange-700 shadow-sm">
              Impact Stories
            </span>
            <h1 className="mt-6 text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight">
              Case <span className="text-orange-600">Studies</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-700 leading-relaxed">
              Explore how Nexografix helps global enterprises solve complex content, 
              digitization, and accessibility challenges through AI-enabled workflows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-10 lg:grid-cols-1"
          >
            {caseStudies.map((study) => (
              <motion.div
                key={study.id}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white p-1 shadow-md transition-all hover:shadow-xl"
              >
                <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
                  {/* Sidebar/Category */}
                  <div className="bg-orange-50/50 p-8 lg:border-r border-orange-100 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                        {study.category}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold text-slate-900">
                        {study.clientType}
                      </h3>
                    </div>
                    <div className="mt-8">
                      <div className="text-sm font-semibold text-slate-500 italic">
                        &quot;Delivering excellence through precision and automation.&quot;
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 sm:p-10">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                          <FiTarget className="shrink-0" />
                          <span className="text-sm font-bold uppercase tracking-wide">The Challenge</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {study.problem}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                          <FiBox className="shrink-0" />
                          <span className="text-sm font-bold uppercase tracking-wide">Nexografix Solution</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {study.delivered}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 rounded-xl bg-slate-900 p-6 text-white shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-full bg-orange-600 p-1">
                          <FiCheckCircle className="text-white" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Outcome & Impact</span>
                          <p className="mt-2 text-lg font-medium leading-relaxed">
                            {study.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-orange-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to transform your workflows?</h2>
          <p className="mt-4 text-lg text-slate-600">
            Let&apos;s discuss how our AI-enabled services can help you achieve similar results.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Book a Consultation <FiArrowRight />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
