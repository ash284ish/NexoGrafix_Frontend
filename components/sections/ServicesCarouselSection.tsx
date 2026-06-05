"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiShield } from "react-icons/fi";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export type ServiceSlide = {
  id: string;
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  image: { src: string; alt: string };
  bullets?: string[];
  chips?: { icon?: React.ReactNode; text: string }[];
};

function SmartImage({
  src,
  alt,
  priority,
  aspect = "aspect-[16/9]",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div className={cx("relative w-full overflow-hidden", R_CARD_INNER, aspect)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(249,115,22,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.98))]" />
      <Image
        src={err ? "/images/blog_fallback.jpg" : src}
        alt={alt}
        fill
        unoptimized
        priority={!!priority}
        sizes="(max-width: 1024px) 100vw, 720px"
        className={cx("object-contain transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErr(true);
          setLoaded(true);
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.22),transparent_62%)]" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cx("border border-white/30 bg-black/20 px-3 py-2 text-[11px] font-extrabold tracking-[0.16em] text-white backdrop-blur", R_CARD_INNER)}>
            LOADING
          </div>
        </div>
      )}
    </div>
  );
}

function MiniChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className={cx("flex items-center gap-2 border border-black/10 bg-white px-4 py-3 shadow-sm", R_CARD_INNER)}>
      <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white", "rounded-md")}>
        {icon}
      </span>
      <span className="text-sm font-semibold text-(--color-text-muted)">{text}</span>
    </div>
  );
}

export type ServicesCarouselSectionProps = {
  slides: ServiceSlide[];
  heading?: string;
  subheading?: string;
  eyebrow?: string;
  autoRotateMs?: number;
  pauseOnHover?: boolean;
  startIndex?: number;
  showTabs?: boolean;
  aspect?: string;

};

export default function ServicesCarouselSection({
  slides,
  heading = "Services & capabilities",
  subheading = "Aap carousel se quickly services explore kar sakte ho.",
  eyebrow = "SERVICES",
  autoRotateMs = 6500,
  pauseOnHover = true,
  startIndex = 0,
  showTabs = true,
  aspect = "aspect-[16/9]",
}: ServicesCarouselSectionProps) {
  const [active, setActive] = useState(startIndex);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const total = slides.length;

  const go = (next: number) => {
    const idx = (next + total) % total;
    setActive(idx);
  };

  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  useEffect(() => {
    setActive(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (!autoRotateMs || total <= 1) return;
    if (pauseOnHover && hovered) return;

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActive((p) => (p + 1) % total);
    }, autoRotateMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRotateMs, hovered, pauseOnHover, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const item = useMemo(() => slides[active], [slides, active]);
  const reverse = active % 2 === 1;
  const Icon = item.Icon;

  const progressPct = total ? ((active + 1) / total) * 100 : 0;

  const chips = item.chips ?? [];

  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] font-extrabold tracking-[0.14em] text-(--color-brand-dark)">{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-extrabold text-(--color-text-main) sm:text-3xl">{heading}</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-(--color-text-muted) sm:text-base">{subheading}</p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={prev}
            className={cx("inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-white shadow-sm transition hover:bg-black/5", R_CARD_INNER)}
            aria-label="Previous"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            onClick={next}
            className={cx("inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-white shadow-sm transition hover:bg-black/5", R_CARD_INNER)}
            aria-label="Next"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cx("border border-black/10 bg-white shadow-[0_26px_90px_rgba(15,23,42,0.10)]", R_CARD)}
      >
        <div className="h-1 w-full bg-black/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-1 bg-(--color-brand)"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className={cx("grid gap-8 lg:gap-12", "lg:grid-cols-[0.95fr_1.05fr]", reverse ? "lg:[&>*:first-child]:order-2" : "")}>
            <div className="relative">
              <div className={cx("border border-black/10 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)]", R_CARD)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.id + "-img"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.22 } }}
                  >
                    <SmartImage src={item.image.src} alt={item.image.alt} aspect={aspect} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id + "-content"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.22 } }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cx("mt-0.5 inline-flex h-12 w-12 items-center justify-center border border-black/10 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]", R_CARD_INNER)}>
                      <Icon className="h-5 w-5 text-(--color-brand-dark)" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[12px] font-extrabold tracking-[0.14em] text-(--color-brand-dark)">
                        {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                      </div>
                      <h3 className="mt-1 text-2xl font-extrabold leading-tight text-(--color-text-main) sm:text-3xl">{item.title}</h3>
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl whitespace-pre-line text-base font-semibold leading-relaxed text-(--color-text-muted)">
                    {item.desc}
                  </p>

                  {!!item.bullets?.length && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {item.bullets.slice(0, 4).map((b) => (
                        <div key={b} className={cx("flex items-start gap-2 border border-black/10 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]", R_CARD_INNER)}>
                          <FiCheckCircle className="mt-0.5 shrink-0 text-(--color-brand-dark)" />
                          <span className="text-sm font-semibold leading-relaxed text-(--color-text-muted)">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!!chips.length && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {chips.slice(0, 2).map((c, idx) => (
                        <MiniChip
                          key={idx}
                          icon={c.icon ?? <FiShield className="text-(--color-brand-dark)" />}
                          text={c.text}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={prev}
                      className={cx("inline-flex flex-1 items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 font-extrabold shadow-sm transition hover:bg-black/5", R_CARD_INNER)}
                    >
                      <FiChevronLeft />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className={cx("inline-flex flex-1 items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 font-extrabold shadow-sm transition hover:bg-black/5", R_CARD_INNER)}
                    >
                      Next
                      <FiChevronRight />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {slides.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cx(
                    "h-2.5 w-2.5 border border-black/15 transition",
                    isActive ? "bg-(--color-brand)" : "bg-black/10 hover:bg-black/20",
                    "rounded-full"
                  )}
                  aria-label={`Go to ${s.title}`}
                />
              );
            })}
          </div>

          {showTabs ? (
            <div className="mt-6 hidden gap-2 overflow-x-auto pb-1 sm:flex">
              {slides.map((s, i) => (
                <button
                  key={s.id + "-tab"}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cx(
                    "shrink-0 border border-black/10 bg-white px-3 py-2 text-xs font-extrabold shadow-sm transition",
                    i === active ? "text-(--color-brand-dark)" : "text-(--color-text-muted) hover:bg-black/5",
                    R_CARD_INNER
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
