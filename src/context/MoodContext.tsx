"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Mood = "dusk" | "dawn";

const STORAGE_KEY = "wtchout-mood";

interface MoodContextValue {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

const MoodContext = createContext<MoodContextValue>({
  mood: "dusk",
  setMood: () => {},
});

export function MoodProvider({ children }: { children: ReactNode }) {
  // Default "dusk" on server AND first client render — hydration-safe.
  const [mood, setMoodState] = useState<Mood>("dusk");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dawn" || stored === "dusk") {
      setMoodState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mood = mood;
  }, [mood]);

  const setMood = useCallback((next: Mood) => {
    setMoodState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing — mood just won't persist.
    }
  }, []);

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
