"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiPlusCircle,
  FiCalendar,
  FiFileText,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";

import StatCard from "@/components/dashboard/assets/StatCard";
import SupportOverviewCard from "@/components/dashboard/assets/SupportOverviewCard";
import ServicesFeedbackDonutCard from "@/components/dashboard/assets/ServicesFeedbackDonutCard";
import { ActivityAndActionsRow } from "@/components/dashboard/assets/RecentActivityFeed";

type Stats = {
  total_newsletters: number;
  total_new_requests: number;
  total_in_progress: number;
  total_resolved: number;
};

type ServiceFeedbackRow = {
  service: string;
  good: number;
  neutral: number;
  bad: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function formatNum(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return "";
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [serviceFeedback, setServiceFeedback] = useState<ServiceFeedbackRow[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // 1) STATS
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingStats(true);

        const res = await fetch(`/api/v1/stats`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Stats fetch failed: ${res.status} ${res.statusText} :: ${txt}`);
        }

        const data = (await res.json()) as Stats;
        setStats(data);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Stats API error:", e);
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // 2) SERVICE FEEDBACK SUMMARY (REAL API)
  useEffect(() => {
    const controller = new AbortController();

    async function loadFeedback() {
      try {
        setLoadingFeedback(true);

        const res = await fetch(`/api/v1/feedback/service-summary`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Feedback summary fetch failed: ${res.status} ${res.statusText} :: ${txt}`);
        }

        const raw = (await res.json()) as Array<{
          service: string;
          good?: number;
          average?: number;
          neutral?: number;
          bad?: number;
        }>;

        const mapped: ServiceFeedbackRow[] = (raw || [])
          .filter((x) => x?.service)
          .map((x) => ({
            service: x.service,
            good: Number(x.good ?? 0),
            neutral: Number(x.neutral ?? x.average ?? 0),
            bad: Number(x.bad ?? 0),
          }));

        setServiceFeedback(mapped);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Feedback summary API error:", e);
        setServiceFeedback([]);
      } finally {
        setLoadingFeedback(false);
      }
    }

    loadFeedback();
    return () => controller.abort();
  }, []);

  // 3) RECENT ACTIVITIES (REAL API)
  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        setLoadingActivities(true);

        const res = await fetch(`/api/v1/dashboard/activities`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error("Activities fetch failed");
        }

        const data = await res.json();
        setActivities(data || []);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Activities API error:", e);
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    }

    loadActivities();
    return () => controller.abort();
  }, []);

  const topStats = useMemo(() => {
    const v = stats;
    const dash = "—";

    return [
      {
        title: "Newsletter Subscribers",
        value: loadingStats ? dash : v ? formatNum(v.total_newsletters) : dash,
        icon: <FiUsers size={20} />,
      },
      {
        title: "New Requests",
        value: loadingStats ? dash : v ? formatNum(v.total_new_requests) : dash,
        icon: <FiMessageSquare size={20} />,
      },
      {
        title: "In Progress",
        value: loadingStats ? dash : v ? formatNum(v.total_in_progress) : dash,
        icon: <FiClock size={20} />,
      },
      {
        title: "Resolved",
        value: loadingStats ? dash : v ? formatNum(v.total_resolved) : dash,
        icon: <FiCheckCircle size={20} />,
      },
    ];
  }, [stats, loadingStats]);

  const contactRequests = useMemo(() => {
    const dashNum = 0;

    return {
      received: loadingStats ? dashNum : stats?.total_new_requests ?? dashNum,
      pending: loadingStats ? dashNum : stats?.total_in_progress ?? dashNum,
      closed: loadingStats ? dashNum : stats?.total_resolved ?? dashNum,
    };
  }, [stats, loadingStats]);

  const feedbackDataForChart = useMemo(() => {
    if (loadingFeedback) return [];
    return serviceFeedback;
  }, [serviceFeedback, loadingFeedback]);

  const mappedActivities = useMemo(() => {
    return activities.map((act) => {
      let icon = <FiMessageSquare size={16} />;
      if (act.type === "feedback") {
        icon = <FiMessageCircle size={16} />;
      } else if (act.type === "newsletter") {
        icon = <FiMail size={16} />;
      }

      return {
        id: act.id,
        title: act.title,
        subtitle: act.subtitle,
        timeText: formatTimeAgo(act.time),
        href: act.href,
        icon,
      };
    });
  }, [activities]);

  const dashboardActions = useMemo(() => [
    {
      id: "q1",
      label: "Newsletter Subscribers",
      href: "/newsletter-users",
      icon: <FiMail size={16} />,
      variant: "primary" as const,
    },
    {
      id: "q2",
      label: "View Contact Requests",
      href: "/contact-users",
      icon: <FiMessageSquare size={16} />,
      variant: "ghost" as const,
    },
    {
      id: "q3",
      label: "Manage Feedback",
      href: "/feedback-page",
      icon: <FiMessageCircle size={16} />,
      variant: "ghost" as const,
    },
    {
      id: "q4",
      label: "CMS Home Page",
      href: "/crm/home",
      icon: <FiFileText size={16} />,
      variant: "primary" as const,
    },
  ], []);

  return (
    <div className="grid gap-6 mb-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topStats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SupportOverviewCard
          received={contactRequests.received}
          pending={contactRequests.pending}
          closed={contactRequests.closed}
        />

        <ServicesFeedbackDonutCard data={feedbackDataForChart} />
      </div>

      <ActivityAndActionsRow activities={mappedActivities} actions={dashboardActions} />
    </div>
  );
}
