import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { QuizLayout } from "@/components/quiz/QuizLayout";
import { BackgroundMusicProvider } from "@/components/quiz/BackgroundMusicProvider";
import { IntroStep } from "@/components/quiz/steps/IntroStep";
import { QuestionStep } from "@/components/quiz/steps/QuestionStep";
import { AnalyzingStep } from "@/components/quiz/steps/AnalyzingStep";
import { UnifiedOfferStep } from "@/components/quiz/steps/UnifiedOfferStep";
import { quizQuestions } from "@/data/quiz-data";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  component: QuizApp,
});

type StepType = "intro" | "quiz" | "analyzing" | "offer";

function QuizApp() {
  const [currentStep, setCurrentStep] = useState<StepType>("intro");
  const [selectedRole, setSelectedRole] = useState<"iniciante" | "umbandista" | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [spiritualBalance, setSpiritualBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);

  const totalSteps = 5;

  const scrollToTop = () => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {}
  };

  // Track initial page view
  useEffect(() => {
    trackEvent("page_view", "intro", 1);
  }, []);

  // Track each step transition
  useEffect(() => {
    scrollToTop();

    if (currentStep === "quiz") {
      trackEvent("question_view", `q${currentQuestionIndex + 1}`, 3 + currentQuestionIndex, {
        questionId: quizQuestions[currentQuestionIndex]?.id,
        questionText: quizQuestions[currentQuestionIndex]?.question,
      });
    } else if (currentStep === "analyzing") {
      trackEvent("analyzing_view", "analyzing", 6);
    } else if (currentStep === "offer") {
      trackEvent("offer_view", "offer_view", 7, { score });
    }
  }, [currentStep, currentQuestionIndex, score]);

  const handleSelectRole = (role: "iniciante" | "umbandista") => {
    if (selectedRole !== null) return;
    setSelectedRole(role);
    trackEvent("role_selected", "role_selected", 2, { role });
    setPreviousBalance(spiritualBalance);
    setSpiritualBalance((prev) => prev + 30);
    setTimeout(() => {
      scrollToTop();
      setCurrentStep("quiz");
    }, 300);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === quizQuestions[currentQuestionIndex]?.correctAnswer;
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
      setSpiritualBalance((prev) => prev + 30);
      scrollToTop();

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setCurrentStep("analyzing");
      }
    }, 450);
  };

  const handleHeaderCheckoutClick = () => {
    trackEvent("checkout_click", "checkout_click", 8, {
      source: "sticky_header",
      price: 19.9,
      currency: "EUR",
    });

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", {
        value: 19.9,
        currency: "EUR",
        content_name: "Mapa Mental da Umbanda + 10 Bonus",
      });
    }
  };

  const calculateCurrentStepNumber = () => {
    switch (currentStep) {
      case "intro":
        return 1;
      case "quiz":
        return 2 + currentQuestionIndex;
      case "analyzing":
        return 5;
      case "offer":
        return 5;
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
        showProgress={currentStep !== "offer"}
        isOfferPage={currentStep === "offer"}
        onCheckoutClick={handleHeaderCheckoutClick}
      >
        {currentStep === "intro" && (
          <IntroStep selectedRole={selectedRole} onSelectRole={handleSelectRole} />
        )}

        {currentStep === "quiz" && quizQuestions[currentQuestionIndex] && (
          <QuestionStep
            question={quizQuestions[currentQuestionIndex]!}
            nextQuestionImage={quizQuestions[currentQuestionIndex + 1]?.questionImage}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        )}

        {currentStep === "analyzing" && (
          <AnalyzingStep onComplete={() => setCurrentStep("offer")} />
        )}

        {currentStep === "offer" && <UnifiedOfferStep />}
      </QuizLayout>
    </BackgroundMusicProvider>
  );
}
