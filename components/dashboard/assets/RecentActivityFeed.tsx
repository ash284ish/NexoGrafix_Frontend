"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiPlusCircle, FiUsers, FiCalendar, FiFileText, FiChevronRight } from "react-icons/fi";

type ActivityItem = {
  id: string;
  title: string;
  subtitle?: string;
  timeText?: string;
  href?: string;
  icon?: React.ReactNode;
  dotColorClass?: string;
};

type ActionItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "ghost";
  disabled?: boolean;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

export function RecentActivityFeed({
  title = "Recent Activity Feed",
  items,
  className,
  maxItems = 8,
  maxHeight = 320,
}: {
  title?: string;
  items: ActivityItem[];
  className?: string;
  maxItems?: number;
  maxHeight?: number;
}) {
  const safe = useMemo(() => items.slice(0, maxItems), [items, maxItems]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className={cx(
        "rounded-md bg-white/70 p-5 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-600">Latest updates in one place</div>
        </div>
        <span className="mt-1 h-10 w-1 rounded-full bg-[#ff7a1a]" />
      </div>

      <div className="mt-4">
        <div className="relative">
          <div className="space-y-3 overflow-auto pr-1" style={{ maxHeight }}>
            {safe.map((a) => {
              const Row = (
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className={cx(
                    "group relative overflow-hidden rounded-md border bg-white/65 px-4 py-3",
                    "border-black/5 hover:border-black/10 hover:bg-white/75",
                    "shadow-[0_10px_28px_-22px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_46px_-28px_rgba(0,0,0,0.45)]"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -left-24 top-0 h-full w-64 rotate-12 bg-linear-to-r from-[#ff7a1a]/0 via-[#ff7a1a]/10 to-[#ff7a1a]/0" />
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-md bg-[#ff7a1a]/12 text-[#ff7a1a] transition group-hover:bg-[#ff7a1a]/16">
                      {a.icon ?? <span className="h-2 w-2 rounded-full bg-[#ff7a1a]" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900">{a.title}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        {a.subtitle ? <span className="truncate">{a.subtitle}</span> : null}
                        {a.timeText ? (
                          <span className="rounded-md bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {a.timeText}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 text-slate-500">
                      <span className="text-[11px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        View
                      </span>
                      <FiChevronRight className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </motion.div>
              );

              return a.href ? (
                <Link key={a.id} href={a.href} className="block focus-visible:outline-none">
                  {Row}
                </Link>
              ) : (
                <div key={a.id}>{Row}</div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function QuickActionsCard({
  title = "Quick Actions",
  actions,
  className,
}: {
  title?: string;
  actions: ActionItem[];
  className?: string;
}) {
  const safe = actions.slice(0, 6);

  const ButtonInner = (a: ActionItem) => (
    <motion.div
      whileHover={!a.disabled ? { y: -2 } : undefined}
      whileTap={!a.disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.18, ease: EASE }}
      className={cx(
        "group relative flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition",
        "border shadow-[0_12px_28px_-22px_rgba(0,0,0,0.35)]",
        a.disabled && "pointer-events-none opacity-50",
        a.variant === "ghost"
          ? "border-black/10 bg-transparent text-slate-900 hover:bg-white/60 hover:border-black/15"
          : "border-[#ff7a1a]/35 bg-transparent text-[#a84a05] hover:bg-[#ff7a1a]/10 hover:border-[#ff7a1a]/55"
      )}
    >
      <span
        className={cx(
          "relative grid h-5 w-5 place-items-center",
          a.variant === "ghost" ? "text-slate-700" : "text-[#ff7a1a]"
        )}
      >
        {a.icon}
      </span>
      <span className="relative truncate">{a.label}</span>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className={cx(
        "rounded-md bg-white/70 p-5 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-600">Common tasks, one click away</div>
        </div>
        <span className="mt-1 h-10 w-1 rounded-full bg-[#ff7a1a]" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {safe.map((a) => {
          if (a.href) {
            return (
              <Link key={a.id} href={a.href} className="block focus-visible:outline-none">
                {ButtonInner(a)}
              </Link>
            );
          }
          return (
            <button
              key={a.id}
              type="button"
              onClick={a.onClick}
              disabled={a.disabled}
              className="text-left"
            >
              {ButtonInner(a)}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export function ActivityAndActionsRow({
  activities,
  actions,
  className,
}: {
  activities: ActivityItem[];
  actions: ActionItem[];
  className?: string;
}) {
  return (
    <div className={cx("grid gap-4 lg:grid-cols-3", className)}>
      <RecentActivityFeed className="lg:col-span-2" items={activities} />
      <QuickActionsCard actions={actions} />
    </div>
  );
}

export const demoActivities: ActivityItem[] = [
  {
    id: "a1",
    title: "New Contact Request • #CR1024",
    subtitle: "John Doe",
    timeText: "2 hours ago",
    href: "/admin/contact-requests/CR1024",
  },
  {
    id: "a2",
    title: "Contact Marked Closed • #CR1011",
    subtitle: "Jane Smith",
    timeText: "4 hours ago",
    href: "/admin/contact-requests/CR1011",
  },
  {
    id: "a3",
    title: "Follow-up Pending • #CR1002",
    subtitle: "Peter Jones",
    timeText: "6 hours ago",
    href: "/admin/contact-requests/CR1002",
  },
];

export const demoActions: ActionItem[] = [
  {
    id: "q1",
    label: "Add Contact",
    href: "/admin/contact-requests/new",
    icon: <FiPlusCircle size={16} />,
    variant: "primary",
  },
  {
    id: "q2",
    label: "View Requests",
    href: "/admin/contact-requests",
    icon: <FiCalendar size={16} />,
    variant: "ghost",
  },
  {
    id: "q3",
    label: "Manage Users",
    href: "/admin/users",
    icon: <FiUsers size={16} />,
    variant: "ghost",
  },
  {
    id: "q4",
    label: "Export Report",
    href: "/admin/contact-requests/export",
    icon: <FiFileText size={16} />,
    variant: "primary",
  },
];
