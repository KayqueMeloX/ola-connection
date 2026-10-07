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
      <div className="mb-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug px-2 mb-3">
          {question.question}
        </h2>
        {question.questionImage && (
          <div className="flex justify-center mb-4">
            <img
              src={question.questionImage}
              alt="Ilustração da pergunta"
              decoding="async"
              className="w-60 h-60 sm:w-72 sm:h-72 max-w-full max-h-[240px] sm:max-h-[280px] object-contain drop-shadow-md"
            />
          </div>
        )}
      </div>

      {/* Options list with subtle vertical spacing */}
      <div className="flex flex-col mb-8 w-full">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;

          if (question.optionStyle === "solid") {
            const solidBg = isSelected
              ? "bg-primary text-primary-foreground ring-4 ring-primary/30 shadow-lg scale-[1.01]"
              : "bg-umbanda-red text-white hover:bg-umbanda-red/90 shadow-md";

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full py-3.5 px-6 rounded-2xl text-center font-bold text-base sm:text-lg transition-all duration-300 block",
                  solidBg,
                  selectedAnswer === null && "hover:scale-[1.02] active:scale-[0.99]"
                )}
                style={{ marginTop: idx === 0 ? "0px" : "7px" }}
              >
                <span>{opt.text}</span>
              </button>
            );
          }

          const borderBg = isSelected
            ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md"
            : "border-border/80 hover:border-primary/50 bg-card shadow-sm hover:bg-muted/30";

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full min-h-[64px] sm:min-h-[72px] p-3.5 sm:p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-300",
                "flex items-center gap-4",
                borderBg,
                selectedAnswer === null && "hover:scale-[1.01] active:scale-[0.99]"
              )}
              style={{ marginTop: idx === 0 ? "0px" : "10px" }}
            >
              {opt.emoji && (
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">{opt.emoji}</span>
                </div>
              )}
              {opt.image && !opt.emoji && (
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
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
