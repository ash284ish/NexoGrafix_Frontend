import { AnimatePresence, motion } from "framer-motion";

export type ToastState = { type: "success" | "error"; msg: string } | null;

export default function ToastTopRight({
  toast,
  onClose,
  duration = 3500,
}: {
  toast: ToastState;
  onClose: () => void;
  duration?: number;
}) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={`${toast.type}:${toast.msg}`}
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={(def) => {
            if (def === "animate") {
              window.setTimeout(onClose, duration);
            }
          }}
          className="fixed right-5 top-5 z-9999 w-[min(420px,calc(100vw-2.5rem))]"
        >
          <div
            className={`flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm font-semibold shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-200/70 bg-emerald-50/90 text-emerald-900"
                : "border-rose-200/70 bg-rose-50/90 text-rose-900"
            }`}
          >
            <div className="leading-relaxed">{toast.msg}</div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-extrabold opacity-80 transition hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
