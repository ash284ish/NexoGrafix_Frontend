"use client";

import { useEffect, useMemo, useState } from "react";

import HeroSection from "@/components/sections/HeroSection";
import WhyChooseNexografix from "@/components/sections/WhyChooseNexografix";
import TrustedBy from "@/components/sections/TrustedBy";
import TestimonialsMarquee from "@/components/sections/TestimonialsMarquee";
import ServicesOverviewSection from "@/components/sections/ServicesOverviewSection";
import CoreFeaturesSection from "@/components/sections/CoreFeaturesSection";
import LatestBlogSection from "@/components/sections/LatestBlogSection";
import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";

function getApiBase() {
    return "";
}

function mapTrustStats(raw: any[]): StatItem[] {
    return (raw || []).map((s) => {
        const key = (s.icon || s.iconKey || "").toLowerCase().trim();
        const icon =
            (defaultIcons as any)[key] ||
            defaultIcons.projects;

        return {
            id: s.id,
            icon,
            value: s.value,
            suffix: s.suffix,
            label: s.label,
            hint: s.hint,
            highlight: s.highlight,
        };
    });
}

export default function Home() {
    const [trust, setTrust] = useState<any>(null);

    useEffect(() => {
        const base = getApiBase();
        const url = `/api/v1/content/data-labelling`;

        fetch(url, { cache: "no-store" })
            .then((r) => r.json())
            .then((json) => setTrust(json.trust_metrics))
            .catch(() => { });
    }, []);

    const stats = useMemo(
        () => mapTrustStats(trust?.stats),
        [trust]
    );

    return (
        <>
            <HeroSection />
            <WhyChooseNexografix />

            {trust && (
                <section className="py-20 sm:py-24">
                    <div className="mx-auto max-w-[80rem] px-6 sm:px-8 lg:px-12">
                        <ProofStatsSection
                            eyebrow={trust.eyebrow}
                            heading={trust.heading}
                            subheading={trust.subheading}
                            stats={stats}
                            columns={3}
                            centered
                        />
                    </div>
                </section>
            )}
            <TrustedBy />
            <TestimonialsMarquee />
            <ServicesOverviewSection />
            <CoreFeaturesSection />
            <LatestBlogSection />
        </>
    );
}
