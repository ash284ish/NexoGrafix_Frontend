"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloatingButton() {
  const phoneNumber = "+919661284439";
  const message = "Hello Nexografix team, I'd like to know more about your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: 1,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative hidden whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-slate-100 sm:block"
      >
        Chat with us
        <div className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-white ring-b ring-r ring-slate-100" />
      </motion.div>

      <div className="relative">
        {/* Continuous expanding pulse rings (Double staggered) */}
        <motion.div
          animate={{
            scale: [1, 1.8, 2.4],
            opacity: [0.4, 0.1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full bg-[#25D366]/30"
        />
        <motion.div
          animate={{
            scale: [1, 1.7, 2.2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.25,
          }}
          className="absolute inset-0 rounded-full bg-[#25D366]/30"
        />

        {/* Main button with floating and wobble animations */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            y: [0, -10, 0] 
          }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 20 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{ 
            scale: 1.15,
            rotate: [0, -12, 12, -12, 12, 0],
            transition: { rotate: { duration: 0.5 } }
          }}
          whileTap={{ scale: 0.9 }}
          className="relative flex h-15.5 w-15.5 items-center justify-center rounded-full bg-white text-[#25D366] shadow-[0_15px_45px_rgba(0,0,0,0.12)] ring-1 ring-black/5 focus:outline-none"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={36} />
        </motion.a>
      </div>
    </div>
  );
}
