import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-md border-b border-border/40">
        {isOfferPage ? (
          <div className="w-full max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col text-left select-none">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span className="text-xs font-black text-foreground">Mapa Mental</span>
                <span className="text-xs font-black text-accent">UMBANDA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground line-through">€ 67</span>
                <span className="text-sm font-black text-primary">€ 19,90</span>
                <span className="text-[9px] font-extrabold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                  70% OFF
                </span>
              </div>
            </div>

            <a
              href={CHECKOUT_URL}
              onClick={onCheckoutClick}
              className="py-2.5 px-4 sm:px-5 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all animate-pulse-scale flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>COMPRAR AGORA</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col items-center px-4 max-w-lg mx-auto w-full pb-8 ${
          isOfferPage ? "pt-20 sm:pt-24" : "pt-52 md:pt-48"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
