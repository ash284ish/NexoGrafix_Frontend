"use client";

import DashboardRemoteStyle from "./DashboardPreviewMain";

export default function DashboardPreviewCode() {
    return (
        <section className="w-full bg-[#FFF7ED] py-16">
            <div className="mx-auto max-w-7xl px-6">
                
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Live Product Demo
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900">
                        Arohio Platform Overview
                    </h2>

                    <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
                        Explore the real, working Arohio dashboard built for accessibility-first workflows —
                        from PDF upload to AI-generated alt text and compliance-ready exports.
                    </p>
                </div>

                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                    <div className="h-[720px]">
                        <DashboardRemoteStyle />
                    </div>
                </div>

            </div>
        </section>
    );
}
