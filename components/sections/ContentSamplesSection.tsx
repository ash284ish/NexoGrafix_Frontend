"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCode, FiBook, FiCheck, FiCopy } from "react-icons/fi";

const XML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<article article-type="research-article" dtd-version="1.2">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">NEXO</journal-id>
      <journal-title-group>
        <journal-title>Nexografix Digital Archives</journal-title>
      </journal-title-group>
    </journal-meta>
    <article-meta>
      <title-group>
        <article-title>AI-Driven Content Transformation</article-title>
      </title-group>
      <abstract>
        <p>Clean, semantic XML ensures cross-platform compatibility.</p>
      </abstract>
    </article-meta>
  </front>
  <body>
    <sec id="s1">
      <title>Introduction</title>
      <p>High-fidelity conversion with preserved metadata.</p>
    </sec>
  </body>
</article>`;

const EPUB_SAMPLE = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Chapter 1</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="bodymatter">
  <section id="ch1" epub:type="chapter">
    <h1 className="chapter-title">The Future of Publishing</h1>
    <p className="first-para">
      <span className="dropcap">N</span>exografix delivers EPUB 3.0+ 
      standard files with accessibility features built-in.
    </p>
    <aside epub:type="sidebar">
      <h3>Key Insight</h3>
      <p>Structured content is accessible content.</p>
    </aside>
  </section>
</body>
</html>`;

export default function ContentSamplesSection() {
  const [activeTab, setActiveTab] = useState<"xml" | "epub">("xml");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-20 overflow-hidden">
      <div className="text-center mb-10">
        <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold tracking-widest text-orange-600 ring-1 ring-inset ring-orange-200">
          QUALITY PROOF
        </span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Clean, Structured Output Samples
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          Whether it&apos;s JATS XML for journals or accessible EPUB 3 for books, 
          we deliver production-ready code that meets global industry standards.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("xml")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-extrabold transition-all ${
              activeTab === "xml"
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
            }`}
          >
            <FiCode /> XML Output (JATS)
          </button>
          <button
            onClick={() => setActiveTab("epub")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-extrabold transition-all ${
              activeTab === "epub"
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
            }`}
          >
            <FiBook /> EPUB 3.0 XHTML
          </button>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-orange-100/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative rounded-xl border border-slate-200 bg-[#0d1117] shadow-2xl overflow-hidden">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                {activeTab === "xml" ? "sample-article.xml" : "chapter-01.xhtml"}
              </div>
              <button
                onClick={() => copyToClipboard(activeTab === "xml" ? XML_SAMPLE : EPUB_SAMPLE)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Copy code"
              >
                {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
              </button>
            </div>

            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-300"
                >
                  {activeTab === "xml" ? (
                    <code>
                      <span className="text-orange-400">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;article</span> <span className="text-purple-400">article-type</span>=<span className="text-green-400">&quot;research-article&quot;</span> <span className="text-purple-400">dtd-version</span>=<span className="text-green-400">&quot;1.2&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;front&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;journal-meta&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;journal-id</span> <span className="text-purple-400">journal-id-type</span>=<span className="text-green-400">&quot;publisher-id&quot;</span><span className="text-blue-400">&gt;</span>NEXO<span className="text-blue-400">&lt;/journal-id&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;journal-title-group&gt;</span>{"\n"}
                      {"        "}<span className="text-blue-400">&lt;journal-title&gt;</span>Nexografix Digital Archives<span className="text-blue-400">&lt;/journal-title&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;/journal-title-group&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;/journal-meta&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;article-meta&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;title-group&gt;</span>{"\n"}
                      {"        "}<span className="text-blue-400">&lt;article-title&gt;</span>AI-Driven Content Transformation<span className="text-blue-400">&lt;/article-title&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;/title-group&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;abstract&gt;</span>{"\n"}
                      {"        "}<span className="text-blue-400">&lt;p&gt;</span>Clean, semantic XML ensures cross-platform compatibility.<span className="text-blue-400">&lt;/p&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;/abstract&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;/article-meta&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;/front&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;body&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;sec</span> <span className="text-purple-400">id</span>=<span className="text-green-400">&quot;s1&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;title&gt;</span>Introduction<span className="text-blue-400">&lt;/title&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;p&gt;</span>High-fidelity conversion with preserved metadata.<span className="text-blue-400">&lt;/p&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;/sec&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;/body&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;/article&gt;</span>
                    </code>
                  ) : (
                    <code>
                      <span className="text-orange-400">&lt;!DOCTYPE html&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;html</span> <span className="text-purple-400">xmlns</span>=<span className="text-green-400">&quot;http://www.w3.org/1999/xhtml&quot;</span> <span className="text-purple-400">xmlns:epub</span>=<span className="text-green-400">&quot;http://www.idpf.org/2007/ops&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;head&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;title&gt;</span>Chapter 1<span className="text-blue-400">&lt;/title&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;link</span> <span className="text-purple-400">rel</span>=<span className="text-green-400">&quot;stylesheet&quot;</span> <span className="text-purple-400">type</span>=<span className="text-green-400">&quot;text/css&quot;</span> <span className="text-purple-400">href</span>=<span className="text-green-400">&quot;style.css&quot;</span><span className="text-blue-400">/&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;/head&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;body</span> <span className="text-purple-400">epub:type</span>=<span className="text-green-400">&quot;bodymatter&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;section</span> <span className="text-purple-400">id</span>=<span className="text-green-400">&quot;ch1&quot;</span> <span className="text-purple-400">epub:type</span>=<span className="text-green-400">&quot;chapter&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;h1</span> <span className="text-purple-400">class</span>=<span className="text-green-400">&quot;chapter-title&quot;</span><span className="text-blue-400">&gt;</span>The Future of Publishing<span className="text-blue-400">&lt;/h1&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;p</span> <span className="text-purple-400">class</span>=<span className="text-green-400">&quot;first-para&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;span</span> <span className="text-purple-400">class</span>=<span className="text-green-400">&quot;dropcap&quot;</span><span className="text-blue-400">&gt;</span>N<span className="text-blue-400">&lt;/span&gt;</span>exografix delivers EPUB 3.0+{"\n"}
                      {"      "}standard files with accessibility features built-in.{"\n"}
                      {"    "}<span className="text-blue-400">&lt;/p&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;aside</span> <span className="text-purple-400">epub:type</span>=<span className="text-green-400">&quot;sidebar&quot;</span><span className="text-blue-400">&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;h3&gt;</span>Key Insight<span className="text-blue-400">&lt;/h3&gt;</span>{"\n"}
                      {"      "}<span className="text-blue-400">&lt;p&gt;</span>Structured content is accessible content.<span className="text-blue-400">&lt;/p&gt;</span>{"\n"}
                      {"    "}<span className="text-blue-400">&lt;/aside&gt;</span>{"\n"}
                      {"  "}<span className="text-blue-400">&lt;/section&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;/body&gt;</span>{"\n"}
                      <span className="text-blue-400">&lt;/html&gt;</span>
                    </code>
                  )}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <FiCheck className="text-green-500" /> W3C VALIDATED
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <FiCheck className="text-green-500" /> EPUBCHECK COMPLIANT
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <FiCheck className="text-green-500" /> WCAG 2.1 COMPLIANT
          </div>
        </div>
      </div>
    </section>
  );
}
