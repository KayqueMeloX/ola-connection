import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { QuizLayout } from "@/components/quiz/QuizLayout";
import { BackgroundMusicProvider } from "@/components/quiz/BackgroundMusicProvider";
import { IntroStep } from "@/components/quiz/steps/IntroStep";
import { QuestionStep } from "@/components/quiz/steps/QuestionStep";
import { AnalyzingStep } from "@/components/quiz/steps/AnalyzingStep";
import { ResultStep } from "@/components/quiz/steps/ResultStep";
import { OfferIntroStep } from "@/components/quiz/steps/OfferIntroStep";
import { HowToReceiveStep } from "@/components/quiz/steps/HowToReceiveStep";
import { BonusStep } from "@/components/quiz/steps/BonusStep";
import { CheckoutOfferStep } from "@/components/quiz/steps/CheckoutOfferStep";
import { quizQuestions } from "@/data/quiz-data";

export const Route = createFileRoute("/")({
  component: QuizApp,
});

type StepType =
  | "intro"
  | "quiz"
  | "analyzing"
  | "result"
  | "offer"
  | "howToReceive"
  | "bonus"
  | "frontDuplo";

function QuizApp() {
  const [currentStep, setCurrentStep] = useState<StepType>("intro");
  const [selectedRole, setSelectedRole] = useState<"iniciante" | "umbandista" | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [spiritualBalance, setSpiritualBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);

  const totalSteps = 16;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, currentQuestionIndex]);

  const handleSelectRole = (role: "iniciante" | "umbandista") => {
    setSelectedRole(role);
    setPreviousBalance(spiritualBalance);
    setSpiritualBalance((prev) => prev + 20);
    setTimeout(() => {
      setCurrentStep("quiz");
    }, 350);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setPreviousBalance(spiritualBalance);
      setSpiritualBalance((prev) => prev + 20);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setCurrentStep("analyzing");
      }
    }, 450);
  };

  const calculateCurrentStepNumber = () => {
    switch (currentStep) {
      case "intro":
        return 1;
      case "quiz":
        return 2 + currentQuestionIndex;
      case "analyzing":
        return 11;
      case "result":
        return 12;
      case "offer":
        return 13;
      case "howToReceive":
        return 14;
      case "bonus":
        return 15;
      case "frontDuplo":
        return 16;
      default:
        return 1;
    }
  };

  return (
    <BackgroundMusicProvider>
      <QuizLayout
        currentStep={calculateCurrentStepNumber()}
        totalSteps={totalSteps}
        spiritualBalance={spiritualBalance}
        previousBalance={previousBalance}
        hideLogo={currentStep === "analyzing"}
      >
        {currentStep === "intro" && (
          <IntroStep selectedRole={selectedRole} onSelectRole={handleSelectRole} />
        )}

        {currentStep === "quiz" && (
          <QuestionStep
            question={quizQuestions[currentQuestionIndex]}
            nextQuestionImage={quizQuestions[currentQuestionIndex + 1]?.questionImage}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        )}

        {currentStep === "analyzing" && (
          <AnalyzingStep onComplete={() => setCurrentStep("result")} />
        )}

        {currentStep === "result" && (
          <ResultStep
            score={score}
            totalQuestions={quizQuestions.length}
            onNext={() => setCurrentStep("offer")}
          />
        )}

        {currentStep === "offer" && (
          <OfferIntroStep onNext={() => setCurrentStep("howToReceive")} />
        )}

        {currentStep === "howToReceive" && (
          <HowToReceiveStep onNext={() => setCurrentStep("bonus")} />
        )}

        {currentStep === "bonus" && (
          <BonusStep onNext={() => setCurrentStep("frontDuplo")} />
        )}

        {currentStep === "frontDuplo" && <CheckoutOfferStep />}

        {/* Footer Support/Hotmart Endorsement Badge */}
        <div className="w-full mt-4 pt-3">
          <img
            src="/assets/rodape-apoio-hotmart.png"
            alt="Apoio: Mãe Célia de Oxossi, Terreiro Cavaleiros de Umbanda - Lisboa/PT, Hotmart"
            className="w-full max-w-sm mx-auto object-contain"
          />
        </div>
      </QuizLayout>
    </BackgroundMusicProvider>
  );
}
