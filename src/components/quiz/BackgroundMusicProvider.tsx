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
    let hasStarted = false;

    const startAudio = () => {
      if (hasStarted) return;
      hasStarted = true;

      // Lazy instantiate audio only on first interaction to avoid blocking initial network
      if (!audioRef.current) {
        const audio = new Audio("/audio/ori-background.mp3");
        audio.loop = true;
        audio.volume = 0.25;
        audio.preload = "auto";
        audioRef.current = audio;
      }

      audioRef.current
        .play()
        .then(() => {
          userInteractedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {});

      document.removeEventListener("click", startAudio);
      document.removeEventListener("touchstart", startAudio);
      document.removeEventListener("pointerdown", startAudio);
    };

    document.addEventListener("click", startAudio, { passive: true, once: true });
    document.addEventListener("touchstart", startAudio, { passive: true, once: true });
    document.addEventListener("pointerdown", startAudio, { passive: true, once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
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
