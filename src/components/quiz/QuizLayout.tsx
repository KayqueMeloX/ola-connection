import React, { useState, useEffect } from "react";
import { ArrowRight, Timer } from "lucide-react";
import { QuizHeader } from "./QuizHeader";
import { SpiritualBalance } from "./SpiritualBalance";

interface QuizLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  spiritualBalance?: number;
  previousBalance?: number;
  hideLogo?: boolean;
  isOfferPage?: boolean;
  onCheckoutClick?: () => void;
}

const CHECKOUT_URL = "https://pay.hotmart.com/G106783622L?checkoutMode=10";

export const QuizLayout: React.FC<QuizLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  spiritualBalance = 0,
  previousBalance = 0,
  hideLogo = false,
  isOfferPage = false,
  onCheckoutClick,
}) => {
  const stepPercent = Math.round((currentStep / totalSteps) * 100);
  const barWidth = Math.max(5, stepPercent);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos

  useEffect(() => {
    if (!isOfferPage) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOfferPage]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Top Bar */}
      {isOfferPage ? (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none bg-transparent pt-2.5 px-4">
          <div className="w-full max-w-lg mx-auto pointer-events-auto">
            <a
              href={CHECKOUT_URL}
              onClick={onCheckoutClick}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white rounded-2xl shadow-2xl transition-all animate-pulse-scale flex items-center justify-between gap-2.5 cursor-pointer"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center leading-tight">
                {/* Linha 1: Tudo na mesma linha */}
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase drop-shadow-sm">
                    QUERO MEU ACESSO POR
                  </span>
                  <span className="font-black text-sm sm:text-base drop-shadow-sm">
                    19,90€
                  </span>
                </div>

                {/* Linha 2: Tamanho maior com texto 'SEU DESCONTO ACABA EM' */}
                <div
                  className="flex items-center justify-center gap-1.5 mt-1.5 px-3.5 py-0.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-inner"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.32)",
                    color: "#fef08a",
                  }}
                >
                  <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-yellow-300 shrink-0" />
                  <span>SEU DESCONTO ACABA EM</span>
                  <span className="font-mono text-white font-black">{formatTimer(timeLeft)}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-sm" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-md border-b border-border/40">
          {showProgress && spiritualBalance > 0 && (
            <div className="flex justify-center pt-3">
              <SpiritualBalance balance={spiritualBalance} previousBalance={previousBalance} />
            </div>
          )}

          {!hideLogo && (
            <div className="flex justify-center py-3 px-4">
              <div className="animate-bounce-soft">
                <QuizHeader />
              </div>
            </div>
          )}

          {showProgress && (
            <div className="flex justify-center pb-3 px-4">
              <div className="w-full max-w-xs relative">
                <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 h-full bg-primary rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                    style={{ width: `${barWidth}%`, left: `${(100 - barWidth) / 2}%` }}
                  >
                    <span className="text-primary-foreground font-bold text-[10px] whitespace-nowrap drop-shadow-sm">
                      {stepPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col items-center px-4 max-w-lg mx-auto w-full pb-8 ${
          isOfferPage ? "pt-28" : "pt-52 md:pt-48"
        }`}
        style={isOfferPage ? { paddingTop: "118px" } : undefined}
      >
        {children}
      </div>
    </div>
  );
};
