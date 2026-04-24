import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { calculateTimerState, type TimerState } from '../../utils/timer';

interface StandupTimerProps {
  startedAt?: number;
  duration?: number;
  timeLimit: number;
}

export function StandupTimer({
  startedAt,
  duration,
  timeLimit,
}: StandupTimerProps) {
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  useEffect(() => {
    // Initial update
    const initialState = calculateTimerState({ startedAt, duration, timeLimit });
    setTimerState(initialState);

    if (duration !== undefined || !startedAt) {
      return;
    }

    const interval = setInterval(() => {
      const newState = calculateTimerState({ startedAt, duration, timeLimit });
      setTimerState(newState);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, duration, timeLimit]);

  if (!timerState) return null;

  const { remaining, isOvertime, elapsed } = timerState;
  const isUrgent = !isOvertime && remaining <= 10 && remaining > 0;

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 brutal-border brutal-shadow">
      <div
        className={`flex items-center gap-2 ${
          isOvertime || isUrgent ? 'animate-pulse text-retro-pink' : 'text-black'
        }`}
      >
        <Timer className="w-4 h-4" />
        <span className="font-black text-lg min-w-[3ch]">
          {isOvertime ? `+${elapsed - timeLimit}S` : `${remaining}S`}
        </span>
      </div>
    </div>
  );
}
