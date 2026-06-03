"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
} from "recharts";

type Props = {
    title?: string;
    received: number;
    pending: number;
    closed: number;
};

function formatCompact(n: number) {
    return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function ContactRequestLineCard({
    title = "Contact Requests",
    received,
    pending,
    closed,
}: Props) {
    const data = useMemo(
        () => [
            { stage: "Received", value: received },
            { stage: "Pending", value: pending },
            { stage: "Closed", value: closed },
        ],
        [received, pending, closed]
    );

    const resolvedPct = received > 0 ? Math.round((closed / received) * 100) : 0;

    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-md bg-white/70 p-5 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-900">{title}</div>
                    <div className="mt-1 text-xs text-slate-600">
                        Stage comparison • {resolvedPct}% resolved
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded-md bg-slate-900/5 px-2 py-1 font-semibold text-slate-800">
                            Received: {formatCompact(received)}
                        </span>
                        <span className="rounded-md bg-amber-500/15 px-2 py-1 font-semibold text-amber-800">
                            Pending: {formatCompact(pending)}
                        </span>
                        <span className="rounded-md bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-800">
                            Closed: {formatCompact(closed)}
                        </span>
                    </div>
                </div>

                <span className="mt-1 h-10 w-1 rounded-full bg-[#ff7a1a]" />
            </div>

            <div className="mt-4 h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 18, right: 10, left: 10, bottom: 6 }}>
                        <defs>
                            <linearGradient id="crStroke" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ff7a1a" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#ff7a1a" stopOpacity={0.9} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.06)" strokeDasharray="4 6" />

                        <XAxis
                            dataKey="stage"
                            tick={{ fontSize: 11, fill: "rgba(15,23,42,0.72)" }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            cursor={{ stroke: "rgba(15,23,42,0.10)", strokeWidth: 1 }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;
                                const val = Number(payload[0].value ?? 0);
                                return (
                                    <div className="rounded-md border border-black/5 bg-white px-3 py-2 shadow-lg">
                                        <div className="text-xs font-bold text-slate-900">{label}</div>
                                        <div className="mt-1 text-xs text-slate-700">
                                            Count: <span className="font-semibold">{val}</span>
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Line
                            type="linear"
                            dataKey="value"
                            stroke="url(#crStroke)"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#ff7a1a" }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: "#ff7a1a", stroke: "#ff7a1a" }}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                formatter={(v) => formatCompact(v as number)}
                                fill="rgba(15,23,42,0.78)"
                                fontSize={11}
                                fontWeight={700}
                                offset={10}
                            />

                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
