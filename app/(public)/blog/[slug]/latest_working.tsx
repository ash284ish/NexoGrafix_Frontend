"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiShare2, FiHeart, FiMessageCircle } from "react-icons/fi";

type BlogDetailsPayload = {
  meta?: { title?: string };
  assets?: { fallback_cover?: string };
  posts: BlogPost[];
};

type BlogPost = {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  readTime: string;
  cover: string;
  excerpt: string;
  slug: string;
  images: string[];
  tags: string[];
  author?: string;
  stats?: { comments?: number; likes?: number; shares?: number };
  content?: {
    intro?: string[];
    sections?: Array<{ heading?: string; bullets?: string[] }>;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const glassCard =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] backdrop-blur";
const glassSoft =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.92))] backdrop-blur";

export default function BlogDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blog_id");

  const [payload, setPayload] = useState<BlogDetailsPayload | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!blogId) throw new Error();

        const mapRes = await fetch(`${API_BASE}/api/v1/content/blog-post-map`, { cache: "no-store" });
        const mapJson = await mapRes.json();

        const mapping = mapJson.mappings?.find(
          (m: any) => String(m.blog_id) === String(blogId)
        );
        if (!mapping) throw new Error();

        const res = await fetch(`${API_BASE}/api/v1/content/blog-details`, { cache: "no-store" });
        const json = (await res.json()) as BlogDetailsPayload;

        const matched = json.posts.find(
          (p) => String(p.id) === String(mapping.post_id)
        );
        if (!matched) throw new Error();

        if (alive) {
          setPayload(json);
          setPost(matched);
        }
      } catch {
        if (alive) setLoadErr(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [blogId]);

  const POSTS = payload?.posts ?? [];
  const recentPosts = post
    ? POSTS.filter((p) => p.id !== post.id).slice(0, 5)
    : [];

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    POSTS.forEach((p) =>
      map.set(p.category, (map.get(p.category) || 0) + 1)
    );
    return Array.from(map.entries());
  }, [POSTS]);

  const filteredRecent = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentPosts;
    return recentPosts.filter((r) =>
      r.title.toLowerCase().includes(q)
    );
  }, [recentPosts, search]);

  if (loadErr) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-600">
        Blog not found
      </div>
    );
  }

  if (!payload || !post) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
        Loading blog...
      </div>
    );
  }

  const hero = post.images?.[0] || post.cover;
  const author = post.author || "admin";

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-extrabold">{post.title}</h1>
      <p className="mt-3 text-slate-600">{post.excerpt}</p>

      <img src={hero} className="mt-6 w-full object-contain" />

      <div className="mt-10 space-y-4">
        {(post.content?.intro ?? []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
