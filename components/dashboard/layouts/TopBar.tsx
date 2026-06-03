"use client";

import Image from "next/image";
import { Search, Bell, MessageCircle, LogOut } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-end border-b border-slate-200 bg-white px-6">
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
        <span className="cursor-pointer hover:text-slate-900">Home</span>
        <span className="cursor-pointer hover:text-slate-900">Features</span>
        <span className="cursor-pointer hover:text-slate-900">Blog</span>
        <span className="cursor-pointer hover:text-slate-900">About Us</span>
      </nav>

      <div className="flex items-center gap-3">
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
          <Search className="h-4 w-4" />
        </button>

        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
        </button>

        <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
          <MessageCircle className="h-4 w-4" />
        </button>

        <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200">
          <Image
            src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
            alt="User avatar"
            width={36}
            height={36}
          />
        </div>

        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
