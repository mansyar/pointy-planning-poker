import { useCallback } from 'react';

type SoundType = 'pop' | 'whoosh' | 'confetti';

export function useSound() {
  const play = useCallback((type: SoundType) => {
    // In a real app, we might preload these
    const audio = new Audio(`/sounds/${type}.wav`);
    audio.play().catch((e) => {
      // Audio might fail if user hasn't interacted with page yet
      console.warn('Sound playback failed:', e);
    });
  }, []);

  return { play };
}
