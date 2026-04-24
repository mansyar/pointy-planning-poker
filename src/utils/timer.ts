export interface TimerState {
  elapsed: number;
  remaining: number;
  isOvertime: boolean;
}

export function calculateTimerState({
  startedAt,
  duration,
  timeLimit,
  now = Date.now(),
}: {
  startedAt?: number;
  duration?: number;
  timeLimit: number;
  now?: number;
}): TimerState | null {
  if (!startedAt && duration === undefined) {
    return null;
  }

  const elapsedSeconds =
    duration !== undefined
      ? duration
      : (startedAt ? Math.floor((now - startedAt) / 1000) : 0);

  const remaining = Math.max(0, timeLimit - elapsedSeconds);
  const isOvertime = elapsedSeconds > timeLimit;

  return {
    elapsed: elapsedSeconds,
    remaining,
    isOvertime,
  };
}
