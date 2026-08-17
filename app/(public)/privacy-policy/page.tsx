"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type SectionKey =
  | "info"
  | "use"
  | "ai"
  | "security"
  | "sharing"
  | "cookies"
  | "rights"
  | "retention"
  | "transfers"
  | "updates"
  | "contact";

type Block =
  | { type: "heading"; value: string; mt?: number }
  | { type: "paragraph"; value: string; mt?: number }
  | { type: "list"; items: string[]; mt?: number }
  | { type: "card_list"; items: Array<{ title: string; description: string }>; mt?: number }
  | { type: "contact"; email?: string; phone?: string; linkedin?: string; address?: string; mt?: number };

type PrivacySection = {
  key: string;
  title: string;
  blocks: Block[];
};

type PrivacyJson = {
  meta: {
    title: string;
    lastUpdated: string;
    lead: string;
  };
  sections: PrivacySection[];
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

function BlockRenderer({ block }: { block: Block }) {
  const style = block.mt ? ({ marginTop: block.mt } as const) : undefined;

  if (block.type === "heading") return <h2 style={style}>{block.value}</h2>;
  if (block.type === "paragraph") return <p style={style}>{block.value}</p>;

  if (block.type === "list") {
    return (
      <ul style={style} className="nx-legal-bullets">
        {(block.items || []).map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "card_list") {
    return (
      <div style={style} className="nx-legal-list">
        {(block.items || []).map((it) => (
          <div key={it.title} className="nx-legal-item">
            <h3>{it.title}</h3>
            <p>{it.description}</p>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    block.email ? { label: "Email", href: `mailto:${block.email}`, text: block.email } : null,
    block.phone ? { label: "Phone", href: `tel:${block.phone.replace(/[^\d+]/g, "")}`, text: block.phone } : null,
    block.linkedin ? { label: "LinkedIn", href: block.linkedin, text: block.linkedin } : null,
  ].filter(Boolean) as Array<{ label: string; href: string; text: string }>;

  return (
    <div style={style} className="nx-legal-contact">
      {block.address ? (
        <div style={{ marginBottom: "12px" }}>
          <span className="nx-legal-label">Registered Address</span>
          <p style={{ margin: "4px 0 0 0", color: "#334155" }}>{block.address}</p>
        </div>
      ) : null}
      {items.map((it) => (
        <div key={`${it.label}-${it.href}`}>
          <span className="nx-legal-label">{it.label}</span>
          <a
            href={it.href}
            target={it.href.startsWith("http") ? "_blank" : undefined}
            rel={it.href.startsWith("http") ? "noreferrer" : undefined}
          >
            {it.text}
          </a>
        </div>
      ))}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PrivacyJson | null>(null);
  const [active, setActive] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        const res = await fetch(`/api/v1/content/privacy-policy`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load privacy policy content");
        const json = (await res.json()) as PrivacyJson;
        if (alive) {
          setData(json);
          if (json.sections && json.sections.length > 0) {
            setActive(json.sections[0].key);
          }
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load privacy policy content");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const sections = useMemo(() => data?.sections || [], [data]);
  const activeSection = sections.find((s) => s.key === active) ?? sections[0];

  return (
    <main className="nx-legal">
      <div className="nx-legal-container">
        <header className="nx-legal-header">
          <h1 className="nx-legal-title">{data?.meta.title || "Privacy Policy"}</h1>
          <p className="nx-legal-meta">Last updated: {data?.meta.lastUpdated || "—"}</p>
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
                {(activeSection?.blocks || []).map((b, idx) => (
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
