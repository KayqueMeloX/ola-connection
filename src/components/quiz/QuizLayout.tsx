import React from "react";
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
}

export const QuizLayout: React.FC<QuizLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  spiritualBalance = 0,
  previousBalance = 0,
  hideLogo = false,
}) => {
  const stepPercent = Math.round((currentStep / totalSteps) * 100);
  const barWidth = Math.max(5, stepPercent);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm border-b border-border/30">
        {showProgress && spiritualBalance > 0 && (
          <div className="flex justify-center pt-2 md:pt-3">
            <SpiritualBalance balance={spiritualBalance} previousBalance={previousBalance} />
          </div>
        )}

        {!hideLogo && (
          <div className="flex justify-center py-2 md:py-3 px-3">
            <div className="animate-bounce-soft">
              <QuizHeader />
            </div>
          </div>
        )}

        {showProgress && (
          <div className="flex justify-center pb-2 md:pb-3 px-4">
            <div className="w-full max-w-xs relative">
              <div className="w-full h-3.5 md:h-4 bg-muted/50 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 h-full bg-primary rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                  style={{ width: `${barWidth}%`, left: `${(100 - barWidth) / 2}%` }}
                >
                  <span className="text-primary-foreground font-bold text-[9px] md:text-[10px] whitespace-nowrap drop-shadow-sm">
                    {stepPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-2 md:py-6 max-w-lg mx-auto w-full pt-36 md:pt-42">
        {children}
      </div>
    </div>
  );
};
