import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface BackgroundMusicContextType {
  pauseForVideo: () => void;
  resumeAfterVideo: () => void;
  isPlaying: boolean;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | null>(null);

export const BackgroundMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/ori-background.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    let hasStarted = false;
    const startAudio = () => {
      if (hasStarted) return;
      audio
        .play()
        .then(() => {
          hasStarted = true;
          userInteractedRef.current = true;
          setIsPlaying(true);
          document.removeEventListener("click", startAudio);
          document.removeEventListener("touchstart", startAudio);
          document.removeEventListener("pointerdown", startAudio);
        })
        .catch(() => {});
    };

    startAudio();
    document.addEventListener("click", startAudio);
    document.addEventListener("touchstart", startAudio);
    document.addEventListener("pointerdown", startAudio);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", startAudio);
      document.removeEventListener("touchstart", startAudio);
      document.removeEventListener("pointerdown", startAudio);
    };
  }, []);

  const pauseForVideo = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      userInteractedRef.current = !audio.paused;
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const resumeAfterVideo = useCallback(() => {
    const audio = audioRef.current;
    if (audio && userInteractedRef.current) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, []);

  return (
    <BackgroundMusicContext.Provider value={{ pauseForVideo, resumeAfterVideo, isPlaying }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  }
  return context;
};
