"use client";

import { motion } from "framer-motion";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-md bg-white px-5 py-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)]"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] bg-[#ff7a1a]" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {value}
          </p>
        </div>

        <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ff7a1a]/15 text-[#ff7a1a]">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
