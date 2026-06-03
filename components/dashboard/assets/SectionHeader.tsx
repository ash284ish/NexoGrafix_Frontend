"use client";

import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
};

export default function SectionHeader({ title, subtitle, right, className }: SectionHeaderProps) {
  return (
    <div className={["mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className].filter(Boolean).join(" ")}>
      <div className="min-w-0">
        <div className="text-lg font-extrabold tracking-tight text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-sm font-semibold text-slate-600">{subtitle}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
