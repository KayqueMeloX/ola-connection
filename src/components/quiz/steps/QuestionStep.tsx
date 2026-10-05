import React from "react";
import { Check, X, Volume2 } from "lucide-react";
import { QuizQuestion } from "@/data/quiz-data";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onSelectAnswer: (index: number) => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  selectedAnswer,
  showResult,
  onSelectAnswer,
}) => {
  return (
    <div className="flex-1 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Pai Oxalá guide header */}
      <div className="flex flex-col items-center mt-4 mb-4">
        <div className="relative">
          <img
            src="/assets/personagem-guia-3d-C5LUUTbc.png"
            alt="Pai Oxalá"
            className="w-24 h-24 object-contain rounded-full shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-md">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-400/10 rounded-full border border-blue-400/40 shadow-sm">
          <span className="text-sm font-semibold text-blue-600 tracking-wide">
            ✨ Pai Oxalá ✨
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground text-center mb-4">{question.question}</h2>
        {question.questionImage && (
          <div className="flex justify-center mb-6">
            <img
              src={question.questionImage}
              alt="Ilustração da pergunta"
              className="w-80 h-80 object-contain"
            />
          </div>
        )}
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-3 mb-8">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = showResult && idx === question.correctAnswer;
          const isWrong = showResult && isSelected && idx !== question.correctAnswer;

          if (question.optionStyle === "solid") {
            const getSolidBg = () => {
              if (showResult) {
                if (isCorrect) return "bg-umbanda-green text-white";
                if (isSelected && isWrong) return "bg-destructive text-white";
              }
              return isSelected
                ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                : "bg-umbanda-red text-white hover:bg-umbanda-red/90";
            };

            return (
              <button
                key={idx}
                onClick={() => onSelectAnswer(idx)}
                disabled={showResult}
                className={cn(
                  "w-full py-5 px-6 rounded-xl text-center font-semibold text-lg transition-all duration-300",
                  "flex items-center justify-center gap-3",
                  getSolidBg(),
                  !showResult && "hover:scale-[1.02] active:scale-100"
                )}
              >
                <span>{opt.text}</span>
                {showResult && isCorrect && <Check className="w-5 h-5" />}
                {showResult && isWrong && <X className="w-5 h-5" />}
              </button>
            );
          }

          const getBorderBg = () => {
            if (showResult) {
              if (isCorrect) return "border-umbanda-green bg-umbanda-green/10";
              if (isSelected && isWrong) return "border-destructive bg-destructive/10";
            }
            return isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50";
          };

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              disabled={showResult}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-4",
                getBorderBg(),
                !showResult && "hover:scale-[1.01] active:scale-100"
              )}
            >
              {opt.emoji && (
                <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                  <span className="text-5xl">{opt.emoji}</span>
                </div>
              )}
              {opt.image && !opt.emoji && (
                <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                  <img src={opt.image} alt={opt.text} className="w-full h-full object-contain" />
                </div>
              )}
              <span className="text-foreground flex-1 text-lg">{opt.text}</span>
              {showResult && (
                <div className="shrink-0">
                  {isCorrect && <Check className="w-5 h-5 text-umbanda-green" />}
                  {isWrong && <X className="w-5 h-5 text-destructive" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Speaking badge */}
      {showResult && (
        <div className="flex justify-center mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-400/10 rounded-full border border-blue-400/40 shadow-sm">
            <div className="relative">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-semibold text-blue-600">
              ✨ Pai Oxalá está falando com você...
            </span>
          </div>
        </div>
      )}

      {/* Explanation Box */}
      {showResult && (
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/70 dark:border-amber-800/40 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden text-left">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center mt-0.5">
              <span className="text-base">✨</span>
            </div>
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400 tracking-wide uppercase text-xs block mb-1">
                Explicação
              </span>
              <p className="text-sm text-foreground/80 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
