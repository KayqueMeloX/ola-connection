import React from "react";
import { ArrowRight } from "lucide-react";
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
          <div className="w-full max-w-lg mx-auto px-4 py-2.5">
            <a
              href={CHECKOUT_URL}
              onClick={onCheckoutClick}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all animate-pulse-scale flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wide"
            >
              <span>QUERO MEU ACESSO AGORA</span>
              <ArrowRight className="w-5 h-5" />
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
