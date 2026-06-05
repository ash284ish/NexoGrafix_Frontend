"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type ServiceFeedback = {
  service: string;
  good: number;
  neutral: number;
  bad: number;
};

type Props = {
  title?: string;
  data: ServiceFeedback[];
};

const COLORS = {
  good: "#ff7a1a",
  neutral: "rgba(15, 23, 42, 0.35)",
  bad: "rgba(239, 68, 68, 0.85)",
};

function toDonutData(data: ServiceFeedback[]) {
  const totals = data.reduce(
    (acc, s) => {
      acc.good += s.good;
      acc.neutral += s.neutral;
      acc.bad += s.bad;
      return acc;
    },
    { good: 0, neutral: 0, bad: 0 }
  );

  return [
    { name: "Good", key: "good" as const, value: totals.good },
    { name: "Neutral", key: "neutral" as const, value: totals.neutral },
    { name: "Bad", key: "bad" as const, value: totals.bad },
  ];
}

export default function ServicesFeedbackDonutCard({ title = "Feedback by Services", data }: Props) {
  const donut = useMemo(() => toDonutData(data), [data]);
  const total = donut.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-md bg-white/70 p-5 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-600">Good / Neutral / Bad ratio (all services combined)</div>
        </div>
        <span className="h-8 w-1 rounded-full bg-[#ff7a1a]" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donut}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={3}
                stroke="rgba(0,0,0,0)"
              >
                {donut.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={
                      entry.key === "good"
                        ? COLORS.good
                        : entry.key === "neutral"
                        ? COLORS.neutral
                        : COLORS.bad
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 18px 50px -20px rgba(0,0,0,0.35)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-700">Services in scope</div>
          <div className="mt-2 space-y-2">
            {data.slice(0, 6).map((s) => (
              <div key={s.service} className="flex items-center justify-between text-sm">
                <span className="truncate font-semibold text-slate-900">{s.service}</span>
                <span className="text-xs text-slate-600">
                  {s.good + s.neutral + s.bad}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md bg-[#ff7a1a]/10 p-3">
            <div className="text-xs font-semibold text-slate-800">Total feedback</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{total}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const demoServiceFeedback: ServiceFeedback[] = [
  { service: "Publishing Digitization", good: 120, neutral: 24, bad: 9 },
  { service: "Data Labeling", good: 88, neutral: 20, bad: 12 },
  { service: "E-learning / EdTech", good: 102, neutral: 18, bad: 7 },
  { service: "Localization & Media", good: 76, neutral: 22, bad: 10 },
  { service: "Digital Platforms", good: 64, neutral: 14, bad: 6 },
  { service: "Arohio", good: 55, neutral: 16, bad: 8 },
];
