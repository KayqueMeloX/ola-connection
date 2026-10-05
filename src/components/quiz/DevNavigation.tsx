import React, { useState, useEffect } from "react";
import { Compass, Home, HelpCircle, Trophy, Gift, ShoppingCart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DevNavigationProps {
  currentStep: string;
  currentQuestion: number;
  totalQuestions: number;
  onGoToStep: (step: string, questionIndex?: number) => void;
}

export const DevNavigation: React.FC<DevNavigationProps> = ({
  currentStep,
  currentQuestion,
  totalQuestions,
  onGoToStep,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const getLabel = () => {
    if (currentStep === "intro") return "/ Intro";
    if (currentStep === "quiz") return `/ Pergunta ${currentQuestion + 1}`;
    if (currentStep === "result") return "/ Resultado";
    if (currentStep === "offer") return "/ Oferta";
    if (currentStep === "howToReceive") return "/ Como Receber";
    if (currentStep === "bonus") return "/ Bônus";
    if (currentStep === "frontDuplo") return "/ Checkout";
    return "/";
  };

  const handleSelect = (step: string, qIndex?: number) => {
    onGoToStep(step, qIndex);
    setOpen(false);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-4 py-2 text-xs md:text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
            <Compass className="w-4 h-4 text-primary" />
            <span>{getLabel()}</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              /
            </kbd>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-2xl" align="center">
          <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 mb-1">
            Navegação do Funil
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleSelect("intro")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "intro" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Intro</span>
            </button>

            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => handleSelect("quiz", i)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentStep === "quiz" && currentQuestion === i
                    ? "bg-primary text-white"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Pergunta {i + 1}</span>
              </button>
            ))}

            <button
              onClick={() => handleSelect("result")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "result" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Resultado</span>
            </button>

            <button
              onClick={() => handleSelect("offer")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "offer" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Oferta</span>
            </button>

            <button
              onClick={() => handleSelect("howToReceive")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "howToReceive"
                  ? "bg-primary text-white"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Como Receber</span>
            </button>

            <button
              onClick={() => handleSelect("bonus")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "bonus" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Bônus</span>
            </button>

            <button
              onClick={() => handleSelect("frontDuplo")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                currentStep === "frontDuplo"
                  ? "bg-primary text-white"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Front Duplo</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
