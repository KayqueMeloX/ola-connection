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
import { trackEvent } from "@/lib/analytics";

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
  const [score, setScore] = useState(0);
  const [spiritualBalance, setSpiritualBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);

  const totalSteps = 16;

  // Track initial page view
  useEffect(() => {
    trackEvent("page_view", "intro", 1);
  }, []);

  // Track each step transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (currentStep === "quiz") {
      trackEvent("question_view", `q${currentQuestionIndex + 1}`, 3 + currentQuestionIndex, {
        questionId: quizQuestions[currentQuestionIndex]?.id,
        questionText: quizQuestions[currentQuestionIndex]?.question,
      });
    } else if (currentStep === "analyzing") {
      trackEvent("analyzing_view", "analyzing", 12);
    } else if (currentStep === "result") {
      trackEvent("result_view", "result", 13, { score });
    } else if (currentStep === "offer") {
      trackEvent("offer_intro_view", "offer_intro", 14);
    } else if (currentStep === "howToReceive") {
      trackEvent("how_to_receive_view", "how_to_receive", 15);
    } else if (currentStep === "bonus") {
      trackEvent("bonus_view", "bonus", 16);
    } else if (currentStep === "frontDuplo") {
      trackEvent("checkout_step_view", "checkout_step", 17);
    }
  }, [currentStep, currentQuestionIndex, score]);

  const handleSelectRole = (role: "iniciante" | "umbandista") => {
    setSelectedRole(role);
    trackEvent("role_selected", "role_selected", 2, { role });
    setPreviousBalance(spiritualBalance);
    setSpiritualBalance((prev) => prev + 20);
    setTimeout(() => {
      setCurrentStep("quiz");
    }, 350);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    trackEvent("question_answered", `q${currentQuestionIndex + 1}`, 3 + currentQuestionIndex, {
      questionId: quizQuestions[currentQuestionIndex]?.id,
      answerIndex: index,
      answerText: quizQuestions[currentQuestionIndex]?.options[index]?.text,
      isCorrect,
    });

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
      </QuizLayout>
    </BackgroundMusicProvider>
  );
}
