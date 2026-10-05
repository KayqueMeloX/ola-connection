import React from "react";
import { Sparkles, Sun, Moon } from "lucide-react";

export const QuizHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        <span className="text-sm font-semibold text-foreground/70">Mapas Mentais da</span>
        <Sparkles className="w-5 h-5 text-accent animate-pulse scale-x-[-1]" />
      </div>
      <div className="relative flex items-center gap-3">
        <Sun className="w-5 h-5 text-amber-500 opacity-80" strokeWidth={2.5} />
        <div className="relative">
          <span className="text-3xl font-black text-accent tracking-wide drop-shadow-sm">
            UMBANDA
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-accent via-secondary to-[#22c55e] rounded-full opacity-80" />
        </div>
        <Moon className="w-5 h-5 text-emerald-600 opacity-80" strokeWidth={2.5} />
      </div>
    </div>
  );
};
