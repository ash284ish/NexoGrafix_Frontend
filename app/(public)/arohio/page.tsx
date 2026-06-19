"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants, useInView, useReducedMotion } from "framer-motion";
import {
  FiCheckCircle,
  FiArrowRight,
  FiMail,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiFileText,
  FiImage,
  FiZap,
} from "react-icons/fi";
import DashboardPreviewCode from "@/components/sections/Dashboardpreviewcode";
import { resolveImageUrl } from "@/lib/apiUrl";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const heroStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const popIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const isYouTube = (url: string) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);

const toYouTubeEmbed = (url: string) => {
  const match =
    url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

type IconKey =
  | "checkCircle"
  | "arrowRight"
  | "mail"
  | "trendingUp"
  | "star"
  | "users"
  | "fileText"
  | "image"
  | "zap";

const iconNode = (key: IconKey, className?: string) => {
  const cls = className || "text-orange-600";
  switch (key) {
    case "checkCircle":
      return <FiCheckCircle className={cls} />;
    case "arrowRight":
      return <FiArrowRight className={cls} />;
    case "mail":
      return <FiMail className={cls} />;
    case "trendingUp":
      return <FiTrendingUp className={cls} />;
    case "star":
      return <FiStar className={cls} />;
    case "users":
      return <FiUsers className={cls} />;
    case "fileText":
      return <FiFileText className={cls} />;
    case "image":
      return <FiImage className={cls} />;
    case "zap":
      return <FiZap className={cls} />;
    default:
      return <FiZap className={cls} />;
  }
};

function SmartImage({
  src,
  alt,
  priority,
  aspect = "aspect-[16/9]",
  fallback = "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: string;
  fallback?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div className={cx("relative w-full overflow-hidden bg-slate-100", R_CARD_INNER, aspect)}>
      {/* Shimmer Effect */}
      {!loaded && !err && (
        <div className="absolute inset-0">
          <div className="h-full w-full animate-pulse bg-linear-to-r from-slate-100 via-slate-200 to-slate-100" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.98))]" />
      <Image
        src={err ? fallback : resolveImageUrl(src)}
        alt={alt}
        fill
        unoptimized
        priority
        loading="eager"
        sizes="(max-width: 1024px) 100vw, 720px"
        className={cx("object-contain transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErr(true);
          setLoaded(true);
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.22),transparent_62%)]" />
    </div>
  );
}

function PrimaryCTA({ href, children, iconRight }: { href: string; children: React.ReactNode; iconRight?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-gray-600",
        R_CARD_INNER
      )}
    >
      {children}
      {iconRight}
    </Link>
  );
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 border border-black/10 bg-white px-6 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:bg-black/5",
        R_CARD_INNER
      )}
    >
      {children}
    </Link>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm", R_CARD_INNER)}>
      {children}
    </span>
  );
}

function MiniChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className={cx("flex items-center gap-2 border border-black/10 bg-white px-4 py-3 shadow-sm", R_CARD_INNER)}>
      <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white", "rounded-md")}>{icon}</span>
      <span className="text-sm font-semibold text-slate-600">{text}</span>
    </div>
  );
}

type StatItem = {
  id: string;
  icon: IconKey;
  value: number;
  suffix?: string;
  label: string;
  hint: string;
  highlight?: boolean;
};

function useCountUp(target: number, startWhen: boolean, durationMs = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!startWhen) return;

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      setValue(next);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [startWhen, target, durationMs]);

  return value;
}

function StatCard({ icon, value, suffix, label, hint, highlight }: { icon: IconKey; value: number; suffix?: string; label: string; hint: string; highlight?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const reduced = useReducedMotion();
  const num = useCountUp(value, inView && !reduced, 900);

  return (
    <motion.div ref={ref} variants={popIn} className={cx("relative overflow-hidden border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]", R_CARD)}>
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-3">
        <div className={cx("inline-flex items-center justify-center text-(--color-brand-dark)", "[&_svg]:h-6 [&_svg]:w-6")}>{iconNode(icon, "text-orange-600")}</div>

        <div className="min-w-0">
          <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{label.toUpperCase()}</div>
          <div className="mt-2 flex items-end gap-2">
            <div className={cx("text-4xl font-extrabold leading-none text-slate-900", highlight && "text-orange-600")}>
              {reduced ? value : num}
              {suffix ? <span className="text-2xl font-extrabold">{suffix}</span> : null}
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">{hint}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ProofStatsSection({ eyebrow = "RESULTS", heading, subheading, stats, columns = 3 }: { eyebrow?: string; heading: string; subheading?: string; stats: StatItem[]; columns?: 2 | 3 | 4 }) {
  const gridCols = columns === 2 ? "lg:grid-cols-2" : columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <div className="mb-6 text-center">
        <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h2>
        {subheading ? <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">{subheading}</p> : null}
      </div>

      <motion.div variants={heroStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={cx("grid gap-4", gridCols)}>
        {stats.map((s) => (
          <StatCard key={s.id} icon={s.icon} value={s.value} suffix={s.suffix} label={s.label} hint={s.hint} highlight={s.highlight} />
        ))}
      </motion.div>
    </motion.section>
  );
}

type FeatureCard = {
  id: string;
  tier?: "Core" | "Pro";
  title: string;
  desc: string;
  bullets: string[];
  cta: { href: string; label: string };
};

function FeatureToolsSection({ eyebrow = "TOOLS", heading, subheading, cards }: { eyebrow?: string; heading: string; subheading?: string; cards: FeatureCard[] }) {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <div className="mb-10 text-center">
        <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h2>
        {subheading ? <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">{subheading}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((c) => {
          const badge =
            c.tier === "Pro" ? (
              <span className={cx("inline-flex items-center border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-indigo-700 shadow-sm", R_CARD_INNER)}>Pro</span>
            ) : (
              <span className={cx("inline-flex items-center border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-orange-600 shadow-sm", R_CARD_INNER)}>Core</span>
            );

          return (
            <div key={c.id} className={cx("border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]", R_CARD)}>
              <div className="flex items-start justify-between gap-3">
                {badge}
                <span className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white shadow-sm rounded-md">
                  <FiZap className="text-orange-600" />
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900">{c.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">{c.desc}</p>

              <div className="mt-5 space-y-3">
                {c.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-50">
                      <FiCheckCircle className="text-orange-600" />
                    </span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link href={c.cta.href} className="text-sm font-extrabold text-orange-600 hover:underline">
                  {c.cta.label}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function ContactCTASection({
  eyebrow = "NEXT STEP",
  heading,
  subheading,
  primaryCta,
  bullets,
  noteText,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryCta: { href: string; label: string };
  bullets: string[];
  noteText?: string;
}) {
  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12">
      <div className={cx("border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]", R_CARD)}>
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h3>
            {subheading ? <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">{subheading}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryCTA href={primaryCta.href} iconRight={<FiArrowRight />}>
                {primaryCta.label}
              </PrimaryCTA>
            </div>

            {noteText ? (
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white shadow-sm", "rounded-md")}>
                  <FiMail className="opacity-70" />
                </span>
                {noteText}
              </div>
            ) : null}
          </div>

          <div className={cx("border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]", R_CARD)}>
            <div className="text-sm font-extrabold text-slate-900">What to share</div>
            <div className="mt-4 space-y-3">
              {bullets.map((t) => (
                <div key={t} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-orange-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

type ArohioPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroImage: { src: string; alt: string };
    chips: Array<{ icon: IconKey; text: string }>;
    badges: Array<{ icon: IconKey; text: string }>;
    primaryCta: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
    pricing?: { inr: { label: string; value: string }; usd: { label: string; value: string } };
  };
  featureTools: {
    eyebrow: string;
    heading: string;
    subheading?: string;
    cards: FeatureCard[];
  };
  proofStats: {
    eyebrow: string;
    heading: string;
    subheading?: string;
    columns?: 2 | 3 | 4;
    stats: StatItem[];
  };
  contactCta: {
    eyebrow: string;
    heading: string;
    subheading?: string;
    primaryCta: { href: string; label: string };
    bullets: string[];
    noteText?: string;
  };
};

function ServiceHeroSection({
  eyebrow,
  title,
  subtitle,
  heroImage,
  chips,
  badges,
  primaryCta,
  secondaryCta,
  pricing,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage: { src: string; alt: string };
  chips: Array<{ icon: React.ReactNode; text: string }>;
  badges: React.ReactNode[];
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  pricing?: { inr: { label: string; value: string }; usd: { label: string; value: string } };
}) {
  return (
    <motion.section variants={heroStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <motion.div variants={heroStagger} className="max-w-2xl">
          <motion.div variants={popIn} className={cx("inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-orange-600 shadow-sm", R_CARD_INNER)}>
            {eyebrow}
          </motion.div>

          <motion.h1 variants={popIn} className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            {title}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
            {subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 grid gap-3 sm:grid-cols-2">
            {chips.map((c) => (
              <MiniChip key={c.text} icon={c.icon} text={c.text} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-2">
            {badges.map((b, idx) => (
              <Pill key={idx}>{b}</Pill>
            ))}
          </motion.div>

          {pricing ? (
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-2">
              <span className={cx("border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm", R_CARD_INNER)}>
                {pricing.inr.label}: <span className="text-orange-600">{pricing.inr.value}</span>
              </span>
              <span className={cx("border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm", R_CARD_INNER)}>
                {pricing.usd.label}: <span className="text-orange-600">{pricing.usd.value}</span>
              </span>
            </motion.div>
          ) : null}

          <motion.div variants={popIn} className="mt-8 flex flex-wrap gap-3">
            <PrimaryCTA href={primaryCta.href} iconRight={<FiArrowRight />}>
              {primaryCta.label}
            </PrimaryCTA>
            {secondaryCta ? <SecondaryCTA href={secondaryCta.href}>{secondaryCta.label}</SecondaryCTA> : null}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="relative">
          <div className={cx("border border-black/10 bg-white p-3 shadow-[0_26px_90px_rgba(15,23,42,0.10)]", R_CARD)}>
            {isYouTube(heroImage.src) ? (
              <iframe
                src={toYouTubeEmbed(heroImage.src)!}
                className="h-full w-full rounded-md"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : /\.(mp4|webm|ogg)(\?.*)?$/.test(heroImage.src) ? (
              <video
                key={heroImage.src}
                src={resolveImageUrl(heroImage.src)}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain rounded-md"
              />
            ) : (
              <SmartImage
                src={heroImage.src}
                alt={heroImage.alt}
                priority
                aspect="aspect-[16/11]"
              />
            )}

          </div>

        </motion.div>
      </div>
    </motion.section>
  );
}

export default function ArohioMainFeaturePage() {
  const [data, setData] = useState<ArohioPageContent | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/content/arohio/main-feature`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load Arohio main feature content");
        const json = (await res.json()) as ArohioPageContent;
        if (alive) setData(json);
      } catch (e) {
        console.error(e);
        if (alive) setData(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const hero = data?.hero;

  const chips = useMemo(() => {
    if (!hero?.chips) return [];
    return hero.chips.map((c) => ({ icon: iconNode(c.icon, "text-orange-600"), text: c.text }));
  }, [hero?.chips]);

  const badges = useMemo(() => {
    if (!hero?.badges) return [];
    return hero.badges.map((b) => (
      <>
        {iconNode(b.icon, "text-orange-600")} {b.text}
      </>
    ));
  }, [hero?.badges]);

  const featureTools = data?.featureTools;
  const proofStats = data?.proofStats;
  const contactCta = data?.contactCta;

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 -left-70 h-180 w-180 rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-35 -right-80 h-190 w-190 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-80 left-[20%] h-180 w-180 rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-7 py-14 sm:px-8 sm:py-20">
        {hero ? (
          <ServiceHeroSection
            eyebrow={hero.eyebrow}
            title={hero.title}
            subtitle={hero.subtitle}
            heroImage={hero.heroImage}
            chips={chips}
            badges={badges}
            pricing={hero.pricing}
            primaryCta={hero.primaryCta}
            secondaryCta={hero.secondaryCta}
          />
        ) : (
          <div className={cx("border border-black/10 bg-white p-8 shadow-sm", R_CARD)}>
            <div className="text-sm font-extrabold text-slate-900">Loading...</div>
          </div>
        )}
      </div>

      <section className="relative w-full py-20">
        <DashboardPreviewCode />
      </section>

      <div className="relative mx-auto max-w-7xl px-7 sm:px-8">
        {featureTools?.cards?.length ? (
          <div className="mx-auto mt-16 max-w-7xl">
            <FeatureToolsSection
              eyebrow={featureTools.eyebrow}
              heading={featureTools.heading}
              subheading={featureTools.subheading}
              cards={featureTools.cards}
            />
          </div>
        ) : null}

        {proofStats?.stats?.length ? (
          <div className="mx-auto mt-16 max-w-7xl">
            <ProofStatsSection
              eyebrow={proofStats.eyebrow}
              heading={proofStats.heading}
              subheading={proofStats.subheading}
              stats={proofStats.stats}
              columns={proofStats.columns ?? 3}
            />
          </div>
        ) : null}

        {contactCta?.bullets?.length ? (
          <div className="mx-auto mt-12 max-w-7xl pb-12">
            <ContactCTASection
              eyebrow={contactCta.eyebrow}
              heading={contactCta.heading}
              subheading={contactCta.subheading}
              primaryCta={contactCta.primaryCta}
              bullets={contactCta.bullets}
              noteText={contactCta.noteText}
            />
          </div>
        ) : null}
      </div>

    </motion.section>
  );
}
