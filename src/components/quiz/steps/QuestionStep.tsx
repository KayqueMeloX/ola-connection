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
      <div className="mb-2">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground text-center mb-2 px-1 leading-snug">
          {question.question}
        </h2>
        {question.questionImage && (
          <div className="flex justify-center mb-3">
            <img
              src={question.questionImage}
              alt="Ilustração da pergunta"
              decoding="async"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 max-h-[140px] sm:max-h-[170px] md:max-h-[220px] object-contain"
            />
          </div>
        )}
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-2.5 sm:gap-3 mb-4">
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
                  "w-full py-3.5 sm:py-4 px-4 rounded-xl text-center font-semibold text-base sm:text-lg transition-all duration-300",
                  "flex items-center justify-center gap-2",
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
                "w-full p-2.5 sm:p-3.5 rounded-xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-3",
                borderBg,
                selectedAnswer === null && "hover:scale-[1.01] active:scale-100"
              )}
            >
              {opt.emoji && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">{opt.emoji}</span>
                </div>
              )}
              {opt.image && !opt.emoji && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
                  <img
                    src={opt.image}
                    alt={opt.text}
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <span className="text-foreground flex-1 text-sm sm:text-base md:text-lg leading-snug">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
