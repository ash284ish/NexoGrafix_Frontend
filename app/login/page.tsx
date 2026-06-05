"use client";

import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const p = phone.replace(/\s+/g, "");
    return p.length >= 8 && password.length > 0 && !loading;
  }, [phone, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.detail ||
          (res.status === 401 ? "Invalid authentication" : "Login failed");
        setErr(msg);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/dashboard");

    } catch (e) {
      setErr("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf7f2]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-[#ff7a1a]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-105 w-105 rounded-full bg-[#ffb37a]/20 blur-3xl" />
        <div className="absolute top-24 right-10 h-16 w-16 rounded-full bg-[#ff7a1a]/25 blur-xl" />
      </div>

      <motion.div
        className="pointer-events-none absolute left-[10%] top-[18%] h-10 w-10 rounded-full bg-[#ff7a1a]/25"
        animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] bottom-[18%] h-14 w-14 rounded-full bg-[#ff7a1a]/18"
        animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <motion.div initial="hidden" animate="show" variants={container} className="w-full max-w-md">
          <motion.div variants={fadeUp} className="mb-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff7a1a]" />
              Secure Access • Nexografix
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Login to your account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your phone number and password to continue.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative rounded-md border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-linear-to-r from-[#ff7a1a] via-[#ff9b4a] to-[#ffd0a8]" />

            <form onSubmit={onSubmit} className="mt-3 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  inputMode="tel"
                  className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    type={showPwd ? "text" : "password"}
                    className="w-full rounded-md border border-black/10 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-2 my-2 rounded-md px-3 text-xs font-semibold text-slate-700 hover:bg-black/5"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>

                {/* <div className="mt-2 flex justify-end">
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#ff7a1a] hover:underline">
                    Forgot password?
                  </Link>
                </div> */}
              </div>

              <motion.button
                whileHover={canSubmit ? { y: -1 } : undefined}
                whileTap={canSubmit ? { scale: 0.99 } : undefined}
                disabled={!canSubmit}
                className={`w-full rounded-md px-4 py-3 text-sm font-bold text-white transition ${canSubmit
                    ? "bg-[#ff7a1a] hover:bg-[#f26d10] focus:outline-none focus:ring-4 focus:ring-[#ff7a1a]/25"
                    : "cursor-not-allowed bg-slate-300"
                  }`}
              >
                {loading ? "Signing in..." : "Login"}
              </motion.button>

              {err ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {err}
                </div>
              ) : null}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
