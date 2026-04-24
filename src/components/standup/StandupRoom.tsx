import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useIdentity } from '../../hooks/useIdentity';
import { JoinModal } from '../shared/JoinModal';
import SectionErrorBoundary from '../shared/SectionErrorBoundary';
import { ClaimBanner } from '../shared/ClaimBanner';
import { EmojiActionBar } from '../shared/EmojiActionBar';
import { EmojiBurst } from '../shared/EmojiBurst';
import { useEmojiReactions } from '../../hooks/useEmojiReactions';
import { usePresence } from '../../hooks/usePresence';
import { useState, useEffect, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { SpeakerQueue } from '../shared/SpeakerQueue';
import { StandupView } from './StandupView';
import { StandupSettingsModal } from './StandupSettingsModal';
import { Users, Settings, Play } from 'lucide-react';

import type { Id } from '../../../convex/_generated/dataModel';

const InviteModal = lazy(() =>
  import('../shared/InviteModal').then((m) => ({ default: m.InviteModal }))
);

interface StandupRoomProps {
  slug: string;
}

export function StandupRoom({ slug }: StandupRoomProps) {
  const { identityId, nickname } = useIdentity();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const room = useQuery(api.rooms.getBySlug, { slug });
  const players = useQuery(api.players.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
  });
  const entries = useQuery(api.standup.listEntries, {
    roomId: room?._id as Id<'rooms'>,
  });

  const joinRoom = useMutation(api.players.join);
  const startStandup = useMutation(api.standup.start);

  const [hasJoined, setHasJoined] = useState(() => !!nickname);

  // Auto-join background sync
  useEffect(() => {
    if (room && identityId && nickname) {
      joinRoom({
        roomId: room._id,
        identityId: identityId,
        name: nickname,
      }).then(() => setHasJoined(true));
    }
  }, [room, identityId, nickname, joinRoom]);

  // Presence & Reactions
  usePresence(room?._id, identityId!, hasJoined, players);
  const { localReactions, sendReaction } = useEmojiReactions(room?._id, identityId);

  if (room === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-gray-500 font-black uppercase">
          Loading standup room...
        </div>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-4 text-4xl">🏜️</div>
        <h2 className="text-2xl font-black mb-2 uppercase">Room not found</h2>
        <a href="/" className="mt-6 font-black uppercase hover:underline">
          Return Home
        </a>
      </div>
    );
  }

  if (!nickname && !hasJoined) {
    return <JoinModal roomSlug={slug} onJoin={(name) => {
      joinRoom({ roomId: room._id, identityId: identityId!, name }).then(() => setHasJoined(true));
    }} />;
  }

  const isFacilitator = room.facilitatorId === identityId;
  const isStarted = entries && entries.length > 0;
  const onlinePlayers = players?.filter(p => p.isOnline) || [];

  const handleStart = async () => {
    try {
      await startStandup({
        roomId: room._id,
        identityId: identityId!,
        config: {
          timeLimit: room.standupTimeLimit || 90,
          autoAdvance: room.standupAutoAdvance ?? false,
        }
      });
      toast.success('Standup started!');
    } catch (e) {
      toast.error('Failed to start standup');
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col overflow-hidden uppercase font-black bg-white">
      {/* Ticker Tape */}
      <div className="bg-black text-white py-2 brutal-border border-l-0 border-r-0 border-t-0 flex items-center text-base tracking-widest overflow-hidden shrink-0">
        <div className="flex whitespace-nowrap marquee-content animate-[marquee_60s_linear_infinite]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="mx-8">
              STANDUP: {slug} // {onlinePlayers.length} ONLINE // {isStarted ? 'SYNC IN PROGRESS' : 'WAITING TO COMMENCE'} // NO LURKERS ALLOWED // 
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex w-full min-h-0 relative overflow-hidden">
        {/* Sidebar: Queue */}
        <aside className="w-80 bg-white brutal-border border-t-0 border-l-0 border-b-0 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 hidden md:flex">
           <div className="mb-6 flex items-center gap-2">
             <Users className="w-6 h-6" />
             <h2 className="text-xl">Speaker Queue</h2>
           </div>
           <SectionErrorBoundary name="Speaker Queue">
             <SpeakerQueue 
               roomId={room._id} 
               myIdentityId={identityId!} 
               facilitatorId={room.facilitatorId}
               timeLimit={room.standupTimeLimit}
             />
           </SectionErrorBoundary>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-grid overflow-hidden relative">
          <ClaimBanner
            roomId={room._id}
            facilitatorId={room.facilitatorId}
            identityId={identityId!}
          />

          {isFacilitator && (
            <div className="absolute top-4 right-4 z-20">
               <button
                 onClick={() => setIsSettingsOpen(true)}
                 className="p-3 bg-white brutal-border brutal-shadow hover:bg-retro-yellow transition-all"
                 title="Standup Settings"
               >
                 <Settings className="w-6 h-6" />
               </button>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
            {!isStarted ? (
              <div className="bg-white brutal-border brutal-shadow p-12 text-center max-w-2xl w-full">
                <div className="mb-8 flex justify-center">
                  <div className="w-24 h-24 bg-retro-pink brutal-border brutal-shadow flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter">
                  READY FOR SYNC?
                </h2>
                <p className="text-sm font-bold mb-10 opacity-60">
                  {onlinePlayers.length} PLAYERS ONLINE. {isFacilitator ? 'START THE SESSION WHEN READY.' : 'WAITING FOR FACILITATOR TO START.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {isFacilitator && (
                    <button
                      onClick={handleStart}
                      className="flex-1 py-4 bg-retro-green text-black text-xl font-black brutal-border brutal-shadow transition-all uppercase flex items-center justify-center gap-3 hover:bg-green-400"
                    >
                      <Play className="w-6 h-6" />
                      Start Standup
                    </button>
                  )}
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex-1 py-4 bg-white text-black text-xl font-black brutal-border brutal-shadow transition-all uppercase hover:bg-retro-blue"
                  >
                    Invite Others
                  </button>
                </div>
              </div>
            ) : (
              <StandupView
                roomId={room._id}
                identityId={identityId!}
                isFacilitator={isFacilitator}
                entries={entries || []}
                players={players || []}
                timeLimit={room.standupTimeLimit || 90}
              />
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-10 right-6 z-50">
        <EmojiActionBar onSelect={sendReaction} />
      </div>

      <EmojiBurst reactions={localReactions} />

      <Suspense fallback={null}>
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          roomUrl={typeof window !== 'undefined' ? window.location.href : ''}
        />
      </Suspense>

      {isFacilitator && (
        <StandupSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          roomId={room._id}
          identityId={identityId!}
          initialTimeLimit={room.standupTimeLimit}
          initialAutoAdvance={room.standupAutoAdvance}
        />
      )}
    </div>
  );
}
