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
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-4 px-2 leading-snug">
          {question.question}
        </h2>
        {question.questionImage && (
          <div className="flex justify-center mb-6">
            <img
              src={question.questionImage}
              alt="Ilustração da pergunta"
              decoding="async"
              className="w-64 h-64 sm:w-72 sm:h-72 max-w-full max-h-[240px] sm:max-h-[280px] object-contain drop-shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-3.5 sm:gap-4 mb-8">
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
                  "w-full py-4 sm:py-5 px-6 rounded-2xl text-center font-bold text-base sm:text-lg transition-all duration-300 shadow-md",
                  "flex items-center justify-center gap-3",
                  solidBg,
                  selectedAnswer === null && "hover:scale-[1.02] active:scale-[0.99]"
                )}
              >
                <span>{opt.text}</span>
              </button>
            );
          }

          const borderBg = isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border hover:border-primary/50 bg-card shadow-sm";

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-4",
                borderBg,
                selectedAnswer === null && "hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {opt.emoji && (
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <span className="text-4xl">{opt.emoji}</span>
                </div>
              )}
              {opt.image && !opt.emoji && (
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
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
