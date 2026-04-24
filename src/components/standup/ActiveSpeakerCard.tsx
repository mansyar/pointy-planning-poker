import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ChevronRight, SkipForward } from 'lucide-react';
import { StandupTimer } from '../shared/StandupTimer';
import type { Id } from '../../../convex/_generated/dataModel';

interface ActiveSpeakerCardProps {
  roomId: Id<'rooms'>;
  identityId: string;
  isFacilitator: boolean;
  speaker: {
    identityId: string;
    name: string;
    startedAt?: number;
  };
  timeLimit: number;
}

export function ActiveSpeakerCard({
  roomId,
  identityId,
  isFacilitator,
  speaker,
  timeLimit,
}: ActiveSpeakerCardProps) {
  const nextSpeaker = useMutation(api.standup.next);
  const skipSpeaker = useMutation(api.standup.skip);

  return (
    <div className="w-full max-w-4xl bg-white brutal-border brutal-shadow-lg p-8 sm:p-12 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-retro-yellow -mr-16 -mt-16 rotate-45 brutal-border" />
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="mb-6 bg-black text-white px-4 py-1 brutal-border text-xs font-black tracking-widest uppercase">
          Currently Speaking
        </div>

        <div className="w-32 h-32 sm:w-48 sm:h-48 brutal-border bg-retro-blue mb-8 flex items-center justify-center text-6xl sm:text-8xl font-black brutal-shadow transition-transform hover:scale-105">
          {speaker.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-4xl sm:text-6xl font-black uppercase mb-8 tracking-tighter leading-none break-all">
          {speaker.name}
        </h2>

        <div className="mb-12 scale-150">
          <StandupTimer 
            startedAt={speaker.startedAt} 
            timeLimit={timeLimit} 
          />
        </div>

        {isFacilitator && (
          <div className="flex flex-col sm:flex-row gap-6 w-full">
            <button
              onClick={() => skipSpeaker({ roomId, identityId })}
              className="flex-1 py-5 brutal-border bg-white text-retro-pink text-xl font-black uppercase flex items-center justify-center gap-3 hover:bg-retro-pink hover:text-white transition-all brutal-shadow"
            >
              <SkipForward className="w-6 h-6" />
              Skip Speaker
            </button>
            <button
              onClick={() => nextSpeaker({ roomId, identityId })}
              className="flex-[2] py-5 brutal-border bg-retro-green text-black text-2xl font-black uppercase flex items-center justify-center gap-3 hover:bg-green-400 transition-all brutal-shadow-lg active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Next Speaker
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
