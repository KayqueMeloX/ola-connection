import React, { useState, useEffect } from "react";

interface AnalyzingStepProps {
  onComplete: () => void;
}

export const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 py-12">
      <div className="w-full max-w-sm mb-8">
        <div className="relative h-10 bg-muted rounded-full overflow-hidden shadow-inner border border-border">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-[#a83232] rounded-full transition-all duration-100 ease-out flex items-center justify-center shadow"
            style={{ width: `${Math.max(progress, 8)}%` }}
          >
            <span className="text-white font-extrabold text-sm">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
        Analisando...
      </h2>
      <p className="text-muted-foreground text-base max-w-xs">
        Estamos analisando suas respostas e preparando seu diagnóstico espiritual...
      </p>
    </div>
  );
};
