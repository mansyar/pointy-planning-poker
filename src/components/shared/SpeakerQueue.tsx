import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { ChevronLeft, ChevronRight, SkipForward, Check, PlayCircle, Clock } from 'lucide-react';
import { StandupTimer } from './StandupTimer';

interface SpeakerQueueProps {
  roomId: Id<'rooms'>;
  myIdentityId: string;
  facilitatorId: string;
  timeLimit?: number;
}

export function SpeakerQueue({
  roomId,
  myIdentityId,
  facilitatorId,
  timeLimit = 90,
}: SpeakerQueueProps) {
  const entries = useQuery(api.standup.listEntries, { roomId });
  const players = useQuery(api.players.listByRoom, { roomId });

  const nextSpeaker = useMutation(api.standup.next);
  const prevSpeaker = useMutation(api.standup.previous);
  const skipSpeaker = useMutation(api.standup.skip);

  if (!entries || !players) return null;

  const isFacilitator = myIdentityId === facilitatorId;

  return (
    <div className="flex flex-col gap-4">
      {/* Facilitator Controls */}
      {isFacilitator && (
        <div className="flex items-center justify-between gap-2 p-3 bg-white brutal-border brutal-shadow">
          <button
            onClick={() => prevSpeaker({ roomId, identityId: myIdentityId })}
            className="flex-1 flex items-center justify-center gap-2 p-2 brutal-border bg-white hover:bg-retro-yellow transition-all"
            title="Previous Speaker"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-black uppercase text-xs hidden sm:inline">Prev</span>
          </button>
          
          <button
            onClick={() => skipSpeaker({ roomId, identityId: myIdentityId })}
            className="flex-1 flex items-center justify-center gap-2 p-2 brutal-border bg-white hover:bg-retro-pink transition-all text-retro-pink hover:text-black"
            title="Skip Speaker"
          >
            <SkipForward className="w-5 h-5" />
            <span className="font-black uppercase text-xs hidden sm:inline">Skip</span>
          </button>

          <button
            onClick={() => nextSpeaker({ roomId, identityId: myIdentityId })}
            className="flex-[2] flex items-center justify-center gap-2 p-2 brutal-border bg-retro-green hover:bg-green-400 transition-all"
            title="Next Speaker"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="font-black uppercase text-sm">Next Speaker</span>
          </button>
        </div>
      )}

      {/* Queue List */}
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => {
          const player = players.find((p) => p.identityId === entry.identityId);
          const isSpeaking = entry.status === 'speaking';
          const isCompleted = entry.status === 'completed';
          const isSkipped = entry.status === 'skipped';

          return (
            <li
              key={entry._id}
              className={`flex items-center justify-between p-3 brutal-border transition-all ${
                isSpeaking
                  ? 'bg-retro-yellow scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10'
                  : isCompleted
                    ? 'bg-retro-green opacity-80'
                    : isSkipped
                      ? 'bg-gray-200 opacity-60'
                      : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 brutal-border bg-white flex items-center justify-center font-black relative">
                  {(player?.name || '?').charAt(0).toUpperCase()}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 bg-retro-green brutal-border p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="absolute -bottom-1 -right-1 bg-retro-pink brutal-border p-0.5 animate-pulse">
                      <PlayCircle className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-black uppercase text-sm truncate max-w-[120px]">
                    {player?.name || 'Unknown'}
                  </span>
                  {isCompleted && entry.duration !== undefined && (
                    <span className="text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.duration}S
                    </span>
                  )}
                  {isSkipped && (
                    <span className="text-[10px] font-bold uppercase italic text-gray-500">
                      Skipped
                    </span>
                  )}
                </div>
              </div>

              {isSpeaking && (
                <StandupTimer 
                  startedAt={entry.startedAt} 
                  timeLimit={timeLimit} 
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
