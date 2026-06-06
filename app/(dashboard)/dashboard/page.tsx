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
} from "react-icons/fi";

import StatCard from "@/components/dashboard/assets/StatCard";
import SupportOverviewCard from "@/components/dashboard/assets/SupportOverviewCard";
import ServicesFeedbackDonutCard from "@/components/dashboard/assets/ServicesFeedbackDonutCard";
import { ActivityAndActionsRow, demoActivities, demoActions } from "@/components/dashboard/assets/RecentActivityFeed";

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function formatNum(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [serviceFeedback, setServiceFeedback] = useState<ServiceFeedbackRow[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // 1) STATS
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingStats(true);

        const res = await fetch(`${API_BASE}/api/v1/stats`, {
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

        // ✅ Change this endpoint if your backend route is different
        const res = await fetch(`${API_BASE}/api/v1/feedback/service-summary`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Feedback summary fetch failed: ${res.status} ${res.statusText} :: ${txt}`);
        }

        // Expected backend example:
        // [
        //   { service: "Assessments", good: 10, average: 2, bad: 1 }
        // ]
        const raw = (await res.json()) as Array<{
          service: string;
          good?: number;
          average?: number; // backend might call it average
          neutral?: number; // or neutral
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

  // ✅ If API empty, fallback optional
  const feedbackDataForChart = useMemo(() => {
    if (loadingFeedback) return [];
    return serviceFeedback;
  }, [serviceFeedback, loadingFeedback]);

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

        {/* ✅ now uses REAL API aggregated data */}
        <ServicesFeedbackDonutCard data={feedbackDataForChart} />
      </div>

      <ActivityAndActionsRow activities={demoActivities} actions={demoActions} />
    </div>
  );
}
