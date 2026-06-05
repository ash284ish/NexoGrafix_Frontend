"use client";

import {
    Upload,
    Bell,
    FolderOpen,
    CheckCircle,
    MessageSquare,
    Timer,
} from "lucide-react";

type Props = {
    onUploadClick: () => void;
};

export default function PayrollPage({ onUploadClick }: Props) {
    const notices = [
        { title: "Your PDF extraction is complete.", time: "2 min ago" },
        { title: "New SEO alt text feature released.", time: "1 day ago" },
        { title: "Subscription renewal due in 5 days.", time: "3 days ago" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Welcome back, <span className="text-teal-600">Sarah K</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Here’s your accessibility progress today.
                    </p>
                </div>

                <button
                    onClick={onUploadClick}
                    className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
                >
                    <Upload className="h-4 w-4" />
                    Upload PDF
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-6 lg:col-span-8">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-md font-semibold text-slate-900">
                                    Credits Overview
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Remaining Credits
                                </div>
                            </div>
                            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                                Buy More
                            </button>
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                            <div className="text-3xl font-semibold text-slate-900">120</div>
                            <div className="pb-1 text-sm text-slate-500">/ 200 left</div>
                        </div>

                        <div className="mt-4 h-3 w-full rounded-md bg-teal-50">
                            <div className="h-3 w-[60%] rounded-md bg-teal-500" />
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <div className="text-md font-semibold text-slate-900">
                                Analytics Snapshot
                            </div>
                            <div className="mt-1 text-sm text-slate-500">Last 5 days</div>
                        </div>

                        <div className="mt-6 rounded-md bg-slate-50 p-4">
                            <svg viewBox="0 0 500 160" className="h-45 w-full">
                                {[0, 1, 2, 3].map((i) => (
                                    <line
                                        key={i}
                                        x1="0"
                                        y1={30 + i * 35}
                                        x2="500"
                                        y2={30 + i * 35}
                                        stroke="#e5e7eb"
                                        strokeDasharray="4 4"
                                    />
                                ))}

                                <polyline
                                    points="0,110 100,90 200,40 300,70 400,50"
                                    fill="none"
                                    stroke="#14b8a6"
                                    strokeWidth="3"
                                />

                                {[110, 90, 40, 70, 50].map((y, i) => (
                                    <circle
                                        key={i}
                                        cx={i * 100}
                                        cy={y}
                                        r="4"
                                        fill="#14b8a6"
                                    />
                                ))}
                            </svg>

                            <div className="mt-4 flex justify-between text-sm font-medium text-slate-600">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 space-y-6 lg:col-span-4">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            Notifications
                        </div>

                        <div className="mt-5 space-y-5">
                            {notices.map((n) => (
                                <div key={n.title} className="flex gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">
                                            {n.title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {n.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            Quick Actions
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {[
                                { icon: FolderOpen, label: "View All Projects" },
                                { icon: CheckCircle, label: "Check SEO Alt Text" },
                                { icon: Upload, label: "Upload New PDF" },
                                { icon: MessageSquare, label: "Open Chatbot" },
                            ].map((a) => (
                                <button
                                    key={a.label}
                                    aria-label={a.label}
                                    className="group flex h-16 items-center justify-center rounded-md border border-dashed border-slate-200 bg-white transition hover:bg-slate-50 hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                >
                                    <a.icon className="h-6 w-6 text-teal-600 transition group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                        <Timer className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-medium text-slate-600">
                            Productivity gain
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900">
                            10 hours saved
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                            this month through automated accessibility workflows
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
