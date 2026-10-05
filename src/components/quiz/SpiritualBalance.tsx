import React, { useState, useEffect } from "react";

const playDing = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const duration = 0.15;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * duration);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * duration);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * duration + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * duration + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * duration);
      osc.stop(ctx.currentTime + idx * duration + duration);
    });
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 800);
  } catch {
    // audio not allowed
  }
};

interface SpiritualBalanceProps {
  balance: number;
  previousBalance: number;
  onBalanceUpdate?: () => void;
}

export const SpiritualBalance: React.FC<SpiritualBalanceProps> = ({
  balance,
  previousBalance,
  onBalanceUpdate,
}) => {
  const [displayValue, setDisplayValue] = useState(previousBalance);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);

  useEffect(() => {
    if (balance > previousBalance) {
      const diff = balance - previousBalance;
      setPointsAdded(diff);
      setIsAnimating(true);
      setShowBadge(true);
      playDing();

      const steps = 10;
      const stepValue = diff / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.round(previousBalance + stepValue * currentStep));
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayValue(balance);
          setIsAnimating(false);
          setTimeout(() => setShowBadge(false), 500);
          onBalanceUpdate?.();
        }
      }, 60);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(balance);
    }
  }, [balance, previousBalance, onBalanceUpdate]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-400/40 backdrop-blur-sm shadow-lg">
      <span className={`text-lg transition-all duration-300 ${isAnimating ? "animate-pulse scale-125" : ""}`}>
        ✨
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[8px] text-foreground dark:text-white font-bold uppercase tracking-wide">
          Saldo
        </span>
        <span className="text-[8px] text-foreground dark:text-white font-bold uppercase tracking-wide">
          Espiritual
        </span>
      </div>
      <div className="flex items-center relative">
        <span
          className={`font-extrabold text-base transition-all duration-300 ${
            isAnimating ? "text-yellow-500 dark:text-yellow-300 scale-110" : "text-foreground dark:text-white"
          }`}
        >
          {displayValue}
        </span>
        {showBadge && (
          <span className="absolute -right-7 -top-0.5 text-xs font-bold text-green-500 animate-bounce">
            +{pointsAdded}
          </span>
        )}
      </div>
    </div>
  );
};
