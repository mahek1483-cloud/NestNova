"use client";

import { useState } from "react";
import { X, MapPin } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#101A1C] text-white px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs sm:text-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#F2A33A] shrink-0" />
          <span>
            <strong>Gokak Scope:</strong> NestNova is exclusively operating in <strong>Gokak, Karnataka, India</strong>. Every listing is restricted to Gokak with verified pricing.
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          className="p-1 hover:text-[#F2A33A] text-gray-400 transition-colors ml-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
