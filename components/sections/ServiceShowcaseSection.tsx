"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type CardItem = {
  Icon?: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

type MiniStat = { label: string; value: string };

type Slide = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: { src: string; alt: string };
  cards: CardItem[];
  miniStats?: MiniStat[];
  badgeRight?: string;
  reverse?: boolean;
  cta?: { label?: string; href: string };
};

type CarouselProps = {
  slides: Slide[];
  startIndex?: number;
  autoRotateMs?: number;
  pauseOnHover?: boolean;
  heading?: string;
  subheading?: string;
};

type Props = Slide | CarouselProps;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

const popIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

const slideSwap: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.25, ease: "easeIn" } },
};

function isCarousel(p: Props): p is CarouselProps {
  return "slides" in p && Array.isArray(p.slides) && p.slides.length > 0;
}

export default function ServiceShowcaseSection(props: Props) {
  const slides = useMemo<Slide[]>(() => {
    if (isCarousel(props)) return props.slides;
    return [props as Slide];
  }, [props]);

  const startIndex = isCarousel(props) ? props.startIndex ?? 0 : 0;
  const autoRotateMs = isCarousel(props) ? props.autoRotateMs ?? 3000 : 0;
  const pauseOnHover = isCarousel(props) ? props.pauseOnHover ?? true : true;

  const heading = isCarousel(props) ? props.heading ?? "Services Overview" : undefined;
  const subheading = isCarousel(props)
    ? props.subheading ??
      "Enterprise-grade solutions for content transformation, accessibility compliance, AI-ready data, and scalable digital platforms."
    : undefined;

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(Math.max(startIndex, 0), Math.max(slides.length - 1, 0))
  );

  // Sync activeIndex with props changes during render
  const [prevMeta, setPrevMeta] = useState({ startIndex, length: slides.length });
  if (startIndex !== prevMeta.startIndex || slides.length !== prevMeta.length) {
    setPrevMeta({ startIndex, length: slides.length });
    setActiveIndex(Math.min(Math.max(startIndex, 0), Math.max(slides.length - 1, 0)));
  }

  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const goNext = () => setActiveIndex((i) => (slides.length ? (i + 1) % slides.length : 0));
  const goPrev = () => setActiveIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0));

  useEffect(() => {
    if (!autoRotateMs || slides.length <= 1) return;
    if (paused) return;

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, autoRotateMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRotateMs, paused, slides.length]);

  const s: Slide = useMemo(() => {
    const base = slides[activeIndex] || ({} as Slide);
    const reverseByIndex = activeIndex % 2 === 1;
    return {
      ...base,
      reverse: base.reverse ?? reverseByIndex,
    };
  }, [slides, activeIndex]);

  const imgSrcRaw = (s.image?.src ?? "").trim();
  const imgAltRaw = (s.image?.alt ?? "").trim();
  const imgSrc = imgSrcRaw.length ? imgSrcRaw : FALLBACK_IMAGE;
  const imgAlt = imgAltRaw.length ? imgAltRaw : s.title || "Service image";

  return (
    <section
      id={s.id}
      className="relative overflow-hidden bg-white py-16 sm:py-20"
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onFocusCapture={() => pauseOnHover && setPaused(true)}
      onBlurCapture={() => pauseOnHover && setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,120,60,0.08),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-56 right-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,160,120,0.06),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {!!heading && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
          >
            <motion.div
              variants={popIn}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-[var(--color-brand-dark)] shadow-sm"
            >
              {heading.toUpperCase()}
            </motion.div>

            {!!subheading && (
              <motion.p
                variants={popIn}
                className="mx-auto mt-4 text-base font-semibold leading-relaxed text-[var(--color-text-muted)] sm:text-lg"
              >
                {subheading}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)] transition hover:shadow-[0_18px_48px_rgba(15,23,42,0.16)] cursor-pointer"
          >
            <FiChevronLeft className="h-5 w-5 text-[var(--color-text-main)]" />
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)] transition hover:shadow-[0_18px_48px_rgba(15,23,42,0.16)] cursor-pointer"
          >
            <FiChevronRight className="h-5 w-5 text-[var(--color-text-main)]" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.10)] backdrop-blur">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to item ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition cursor-pointer ${
                  i === activeIndex ? "bg-[var(--color-text-main)]" : "bg-black/20 hover:bg-black/35"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatePresence mode="wait">
          <motion.div key={s.id || activeIndex} variants={slideSwap} initial="hidden" animate="show" exit="exit">
            <div className={`grid items-center gap-12 lg:grid-cols-2 ${s.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.985 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.10)]"
                >
                  <div className="relative p-5 sm:p-6">
                    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
                      <motion.div variants={popIn} className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold tracking-[0.14em] text-[var(--color-brand-dark)] shadow-sm">
                          {s.eyebrow ?? "FEATURE SNAPSHOT"}
                        </div>
                        <div className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-extrabold text-[var(--color-text-main)]">
                          {s.badgeRight ?? "Visual Preview"}
                        </div>
                      </motion.div>

                      <motion.div variants={popIn} className="mt-5 overflow-hidden rounded-md border border-black/10 bg-white">
                        <div className="relative aspect-[16/10] w-full">
                          <img
                            src={imgSrc}
                            alt={imgAlt}
                            className="absolute inset-0 h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.30),transparent_55%)]" />
                        </div>
                      </motion.div>

                      {!!s.miniStats?.length && (
                        <motion.div variants={popIn} className="mt-5 grid gap-3 sm:grid-cols-2">
                          {s.miniStats.map((st) => (
                            <div
                              key={st.label}
                              className="rounded-md border border-black/10 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                            >
                              <div className="text-[11px] font-extrabold tracking-[0.14em] text-black/50">{st.label}</div>
                              <div className="mt-1 text-sm font-extrabold text-[var(--color-text-main)]">{st.value}</div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                <motion.div
                  variants={popIn}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-[var(--color-brand-dark)] shadow-sm"
                >
                  {s.eyebrow ?? "WHAT WE DELIVER"}
                </motion.div>

                <motion.h2 variants={popIn} className="mt-6 text-4xl font-extrabold leading-tight text-[var(--color-text-main)] sm:text-5xl">
                  {s.title}
                </motion.h2>

                {!!s.subtitle && (
                  <motion.p variants={popIn} className="mt-4 text-base font-semibold leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                    {s.subtitle}
                  </motion.p>
                )}

                <motion.div variants={container} className="mt-9 grid gap-5 sm:grid-cols-2">
                  {(s.cards || []).map(({ Icon, title: cTitle, desc }) => (
                    <motion.div
                      key={cTitle}
                      variants={popIn}
                      className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-md border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(15,23,42,0.10)]"
                    >
                      <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-md border border-black/10 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                        {Icon ? <Icon className="h-6 w-6 text-[var(--color-brand-dark)]" /> : null}
                      </div>

                      <div className="relative mt-4 text-sm font-extrabold text-[var(--color-text-main)]">{cTitle}</div>
                      <div className="relative mt-2 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{desc}</div>

                      <div className="relative mt-auto pt-5">
                        <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-extrabold text-[var(--color-text-main)]">
                          Enterprise-ready
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {!!s.cta?.href && (
                  <motion.div variants={popIn} className="mt-10 flex flex-wrap items-center gap-3">
                    <a
                      href={s.cta.href}
                      className="inline-flex items-center justify-center rounded-md bg-[var(--color-brand-dark)] px-5 py-3 text-sm font-extrabold text-white hover:text-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition hover:opacity-95"
                    >
                      {s.cta.label ?? "Explore"}
                    </a>

                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-3 text-sm font-extrabold text-[var(--color-text-main)] shadow-sm transition hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
                    >
                      Talk to us
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
