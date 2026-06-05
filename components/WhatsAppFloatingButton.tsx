"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloatingButton() {
  const phoneNumber = "+919661284439";
  const message = "Hello Nexografix team, I'd like to know more about your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-9999 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
      
      {/* Tooltip-like badge */}
      <span className="absolute -top-12 right-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md ring-1 ring-slate-200 group-hover:block sm:block">
        Chat with us
        <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-white ring-b ring-r ring-slate-200" />
      </span>
    </motion.a>
  );
}
