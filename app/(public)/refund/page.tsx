"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SectionKey =
  | "overview"
  | "eligibility"
  | "nonRefundable"
  | "subscriptions"
  | "milestones"
  | "cancellations"
  | "refundProcess"
  | "timelines"
  | "exceptions"
  | "chargebacks"
  | "contact";

type PolicyBlock =
  | { type: "p"; text: string }
  | {
      type: "ul";
      items: Array<
        | { text: string }
        | { label: string; text: string }
      >;
    }
  | {
      type: "contact";
      items: Array<{ label: string; value: string; href: string }>;
    };

type PolicySection = {
  key: SectionKey;
  toc_title: string;
  heading: string;
  blocks: PolicyBlock[];
};

type RefundPolicyJson = {
  meta: {
    title: string;
    last_updated: string;
    lead: string;
  };
  sections: PolicySection[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const panelVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(2px)" },
};

const tocItemVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
};

function isSectionKey(v: unknown): v is SectionKey {
  return (
    v === "overview" ||
    v === "eligibility" ||
    v === "nonRefundable" ||
    v === "subscriptions" ||
    v === "milestones" ||
    v === "cancellations" ||
    v === "refundProcess" ||
    v === "timelines" ||
    v === "exceptions" ||
    v === "chargebacks" ||
    v === "contact"
  );
}

function renderBlock(block: PolicyBlock, idx: number) {
  if (block.type === "p") {
    return (
      <p key={idx} style={idx > 0 ? { marginTop: 12 } : undefined}>
        {block.text}
      </p>
    );
  }

  if (block.type === "ul") {
    return (
      <ul key={idx} className="nx-legal-bullets" style={idx > 0 ? { marginTop: 12 } : undefined}>
        {block.items.map((it, i) => {
          const key = `${idx}-ul-${i}`;
          if ("label" in it) {
            return (
              <li key={key}>
                <strong>{it.label}</strong> {it.text}
              </li>
            );
          }
          return <li key={key}>{it.text}</li>;
        })}
      </ul>
    );
  }

  if (block.type === "contact") {
    return (
      <div key={idx} className="nx-legal-contact" style={{ marginTop: 12 }}>
        {block.items.map((it, i) => (
          <div key={`${idx}-c-${i}`}>
            <span className="nx-legal-label">{it.label}</span>
            <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {it.value}
            </a>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function RefundPolicyPage() {
  const [data, setData] = useState<RefundPolicyJson | null>(null);
  const [active, setActive] = useState<SectionKey>("overview");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`/api/v1/content/refund-policy`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load refund policy");

        const json = (await res.json()) as RefundPolicyJson;

        if (!json?.meta?.title || !Array.isArray(json?.sections)) {
          throw new Error("Invalid refund policy JSON");
        }

        // sanitize keys (avoid crash if backend sends wrong keys)
        const sanitized: RefundPolicyJson = {
          meta: json.meta,
          sections: json.sections
            .filter((s) => isSectionKey(s.key))
            .map((s) => ({
              key: s.key,
              toc_title: s.toc_title || "",
              heading: s.heading || "",
              blocks: Array.isArray(s.blocks) ? s.blocks : [],
            })),
        };

        if (!alive) return;

        setData(sanitized);

        // keep active valid
        const hasActive = sanitized.sections.some((s) => s.key === active);
        if (!hasActive && sanitized.sections[0]) setActive(sanitized.sections[0].key);
      } catch (e) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [active]);

  const sections = useMemo(() => data?.sections ?? [], [data]);

  const activeSection =
    sections.find((s) => s.key === active) ??
    sections[0] ??
    ({
      key: "overview",
      toc_title: "Overview",
      heading: "1. Overview",
      blocks: [{ type: "p", text: "Content not available." }],
    } as PolicySection);

  const meta = data?.meta;

  return (
    <main className="nx-legal">
      <div className="nx-legal-container">
        <header className="nx-legal-header">
          <h1 className="nx-legal-title">{meta?.title || "Refund Policy"}</h1>
          <p className="nx-legal-meta">Last updated: {meta?.last_updated || "—"}</p>
          <p className="nx-legal-lead">{meta?.lead || ""}</p>
        </header>

        <div className="nx-legal-split">
          <aside className="nx-legal-tocCard" aria-label="On this page">
            <div className="nx-legal-tocTitle">On this page</div>

            <nav className="nx-legal-tocNav">
              {loading ? (
                <div className="nx-legal-muted">Loading…</div>
              ) : err ? (
                <div className="nx-legal-muted">{err}</div>
              ) : (
                sections.map((s) => {
                  const isActive = s.key === active;

                  return (
                    <motion.button
                      key={s.key}
                      type="button"
                      className={`nx-legal-tocBtn ${isActive ? "is-active" : ""}`}
                      onClick={() => setActive(s.key)}
                      variants={tocItemVariants}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {s.toc_title}
                      <span className="nx-legal-tocArrow">→</span>
                    </motion.button>
                  );
                })
              )}
            </nav>
          </aside>

          <article className="nx-legal-panel" aria-live="polite">
            <div className="nx-legal-panelTop">
              <div className="nx-legal-badge">{activeSection.toc_title}</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="nx-legal-panelBody"
              >
                <h2>{activeSection.heading}</h2>

                {activeSection.blocks?.map((b, idx) => renderBlock(b, idx))}

                {err ? (
                  <p style={{ marginTop: 12 }}>
                    {err}
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </article>
        </div>
      </div>
    </main>
  );
}
