import React, { useRef, useEffect, useCallback } from "react";
import { Volume2 } from "lucide-react";

interface PaiOxalaVoiceHook {
  speak: (text: string) => void;
  speakQuestion: (question: string, questionId: number) => void;
  speakExplanation: (explanation: string, isJourney?: boolean) => void;
  isJourneyQuestion: (questionId: number) => boolean;
  stop: () => void;
  isSpeaking: boolean;
}

const JOURNEY_QUESTION_IDS = [2, 4, 6, 7, 8, 9];
const NARRATED_QUESTION_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const usePaiOxalaVoice = (): PaiOxalaVoiceHook => {
  const isSpeakingRef = useRef(false);
  const narratedQuestionsRef = useRef(new Set<number>());

  const stop = useCallback(() => {
    isSpeakingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const speak = useCallback((text: string) => {
    // Optional Web Speech API or voice handler
  }, []);

  const speakQuestion = useCallback(
    (questionText: string, questionId: number) => {
      if (questionId !== undefined && NARRATED_QUESTION_IDS.includes(questionId)) {
        if (!narratedQuestionsRef.current.has(questionId)) {
          narratedQuestionsRef.current.add(questionId);
          speak(questionText);
        }
      }
    },
    [speak]
  );

  const isJourneyQuestion = useCallback((questionId: number) => {
    return JOURNEY_QUESTION_IDS.includes(questionId);
  }, []);

  const speakExplanation = useCallback((explanationText: string, isJourney: boolean = false) => {
    speak(explanationText);
  }, [speak]);

  return {
    speak,
    speakQuestion,
    speakExplanation,
    isJourneyQuestion,
    stop,
    isSpeaking: isSpeakingRef.current,
  };
};

export const PaiOxalaIndicator: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-md mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full border border-primary/30">
        <div className="relative">
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-semibold text-primary">
          ✨ Pai Oxalá está falando com você...
        </span>
      </div>
    </div>
  );
};
