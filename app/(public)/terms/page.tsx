"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type SectionKey =
  | "acceptance"
  | "services"
  | "accounts"
  | "use"
  | "ip"
  | "customerContent"
  | "ai"
  | "payments"
  | "thirdParty"
  | "disclaimers"
  | "liability"
  | "termination"
  | "governing"
  | "contact";

type UlItem = string | { text: string; key?: string };

type Block =
  | { type: "h2"; text: string; mt?: number }
  | { type: "h3"; text: string; mt?: number }
  | { type: "p"; text: string; mt?: number }
  | { type: "ul"; items: UlItem[]; className?: string; mt?: number }
  | {
      type: "contact";
      items: Array<{ label: string; href: string; text: string }>;
      mt?: number;
    };

type TermsSection = {
  key: SectionKey;
  title: string;
  blocks: Block[];
};

type TermsJson = {
  meta: {
    page_title: string;
    last_updated: string;
    lead: string;
  };
  sections: TermsSection[];
};

const panelVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(2px)" },
};

const tocItemVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
};

function toLiText(it: UlItem) {
  return typeof it === "string" ? it : it.text;
}

function toLiKey(it: UlItem, idx: number) {
  if (typeof it === "string") return `li-${idx}-${it}`;
  return it.key ? `li-${it.key}` : `li-${idx}-${it.text}`;
}

function BlockRenderer({ block }: { block: Block }) {
  const style = block.mt ? ({ marginTop: block.mt } as const) : undefined;

  if (block.type === "h2") return <h2 style={style}>{block.text}</h2>;
  if (block.type === "h3") return <h3 style={style}>{block.text}</h3>;
  if (block.type === "p") return <p style={style}>{block.text}</p>;

  if (block.type === "ul") {
    return (
      <ul style={style} className={block.className || "nx-legal-bullets"}>
        {block.items.map((it, idx) => (
          <li key={toLiKey(it, idx)}>{toLiText(it)}</li>
        ))}
      </ul>
    );
  }

  return (
    <div style={style} className="nx-legal-contact">
      {block.items.map((it) => {
        const isHttp = /^https?:\/\//i.test(it.href);
        return (
          <div key={`${it.label}-${it.href}`}>
            <span className="nx-legal-label">{it.label}</span>
            <a
              href={it.href}
              target={isHttp ? "_blank" : undefined}
              rel={isHttp ? "noreferrer" : undefined}
            >
              {it.text}
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default function TermsPage() {
  const [data, setData] = useState<TermsJson | null>(null);
  const [active, setActive] = useState<SectionKey>("acceptance");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        const res = await fetch(`/api/v1/content/terms`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load terms content");
        const json = (await res.json()) as TermsJson;
        if (alive) setData(json);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load terms content");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const sections = useMemo(() => data?.sections || [], [data]);

  useEffect(() => {
    if (!sections.length) return;
    const exists = sections.some((s) => s.key === active);
    if (!exists) setActive(sections[0].key);
  }, [sections, active]);

  const activeSection = sections.find((s) => s.key === active) ?? sections[0];

  return (
    <main className="nx-legal">
      <div className="nx-legal-container">
        <header className="nx-legal-header">
          <h1 className="nx-legal-title">{data?.meta.page_title || "Terms & Conditions"}</h1>
          <p className="nx-legal-meta">Last updated: {data?.meta.last_updated || "—"}</p>
          <p className="nx-legal-lead">{data?.meta.lead || ""}</p>
          {error ? <p style={{ marginTop: 10 }}>{error}</p> : null}
        </header>

        <div className="nx-legal-split">
          <aside className="nx-legal-tocCard" aria-label="On this page">
            <div className="nx-legal-tocTitle">On this page</div>

            <nav className="nx-legal-tocNav">
              {sections.map((s) => {
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
                    {s.title}
                    <span className="nx-legal-tocArrow">→</span>
                  </motion.button>
                );
              })}
            </nav>
          </aside>

          <article className="nx-legal-panel" aria-live="polite">
            <div className="nx-legal-panelTop">
              <div className="nx-legal-badge">{activeSection?.title || ""}</div>
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
                {activeSection?.blocks?.map((b, idx) => (
                  <BlockRenderer key={`${active}-${idx}`} block={b} />
                ))}
              </motion.div>
            </AnimatePresence>
          </article>
        </div>
      </div>
    </main>
  );
}
