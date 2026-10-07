import React, { useEffect } from "react";
import { QuizQuestion } from "@/data/quiz-data";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  question: QuizQuestion;
  nextQuestionImage?: string;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  nextQuestionImage,
  selectedAnswer,
  onSelectAnswer,
}) => {
  // Preload next question image for instant transitions
  useEffect(() => {
    if (nextQuestionImage) {
      const img = new Image();
      img.src = nextQuestionImage;
    }
  }, [nextQuestionImage]);

  return (
    <div className="flex-1 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Question Text */}
      <div className="mb-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center leading-snug px-1 mb-2.5">
          {question.question}
        </h2>
        {question.questionImage && (
          <div className="flex justify-center mb-3">
            <img
              src={question.questionImage}
              alt="Ilustração da pergunta"
              decoding="async"
              className="h-44 sm:h-52 md:h-60 w-auto max-w-[320px] object-contain drop-shadow-md"
            />
          </div>
        )}
      </div>

      {/* Options list - Formatted as elegant cards */}
      <div className="flex flex-col gap-3 sm:gap-3.5 mb-6">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const borderBg = isSelected
            ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md"
            : "border-border/80 hover:border-primary/50 bg-card shadow-sm hover:bg-muted/30";

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full min-h-[62px] sm:min-h-[68px] p-3.5 sm:p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-3.5",
                borderBg,
                selectedAnswer === null && "hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {opt.emoji && (
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                </div>
              )}
              {opt.image && !opt.emoji && (
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
                  <img
                    src={opt.image}
                    alt={opt.text}
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <span className="text-foreground flex-1 text-base sm:text-lg font-bold leading-snug">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
