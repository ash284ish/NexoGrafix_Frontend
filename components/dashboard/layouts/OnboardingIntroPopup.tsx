"use client";

import { motion } from "framer-motion";

type Props = {
  onStart: () => void;
  onSkip?: () => void;
};

export default function OnboardingIntroPopup({ onStart, onSkip }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center pt-32">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          Welcome
        </div>

        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Let’s make your PDFs accessible
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          We’ll guide you through a simple step-by-step flow:
          upload PDFs, review images, generate alt text, and export
          accessibility-ready results.
        </p>

        <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
          <ul className="space-y-2">
            <li>• Organize work using projects</li>
            <li>• AI-assisted alt text generation</li>
            <li>• Review, approve & export</li>
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Skip tour
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={onStart}
            className="rounded-md bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600"
          >
            Start walkthrough →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
