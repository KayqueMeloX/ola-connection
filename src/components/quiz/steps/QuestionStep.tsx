import React from "react";
import { Volume2 } from "lucide-react";
import { QuizQuestion } from "@/data/quiz-data";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  selectedAnswer,
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

      {/* Question Text */}
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

          if (question.optionStyle === "solid") {
            const solidBg = isSelected
              ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
              : "bg-umbanda-red text-white hover:bg-umbanda-red/90";

            return (
              <button
                key={idx}
                onClick={() => onSelectAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full py-5 px-6 rounded-xl text-center font-semibold text-lg transition-all duration-300",
                  "flex items-center justify-center gap-3",
                  solidBg,
                  selectedAnswer === null && "hover:scale-[1.02] active:scale-100"
                )}
              >
                <span>{opt.text}</span>
              </button>
            );
          }

          const borderBg = isSelected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50";

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-4",
                borderBg,
                selectedAnswer === null && "hover:scale-[1.01] active:scale-100"
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
            </button>
          );
        })}
      </div>
    </div>
  );
};
