import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useIdentity } from '../../hooks/useIdentity';
import { CardDeck } from './CardDeck';
import { EmojiActionBar } from '../shared/EmojiActionBar';
import { useSound } from '../../hooks/useSound';
import { RoundTimer } from './RoundTimer';
import { toast } from 'sonner';
import type { Id } from '../../../convex/_generated/dataModel';
import { Smartphone, LogOut, Play, RotateCcw, Eye } from 'lucide-react';

interface MobileControllerProps {
  slug: string;
  onExit: () => void;
}

export function MobileController({ slug, onExit }: MobileControllerProps) {
  const { identityId, nickname } = useIdentity();
  const { play } = useSound();
  const room = useQuery(api.rooms.getBySlug, { slug });
  const votes = useQuery(api.votes.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
    identityId: identityId!,
  });
  const topics = useQuery(api.topics.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
  });

  const castVote = useMutation(api.votes.cast);
  const revealVotes = useMutation(api.rooms.reveal);
  const resetRound = useMutation(api.rooms.reset);
  const nextTopic = useMutation(api.rooms.nextTopic);

  const activeTopic = topics?.find((t) => t._id === room?.currentTopicId);
  const myVote = votes?.find((v) => v.identityId === identityId)?.value;
  const isFacilitator = room?.facilitatorId === identityId;

  const handleVote = async (value: string | number) => {
    if (!room) return;
    try {
      play('pop');
      await castVote({
        roomId: room._id,
        identityId: identityId!,
        topicId: room.currentTopicId,
        value,
      });
      // Haptic feedback
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      toast.success('Vote cast!');
    } catch {
      toast.error('Failed to cast vote');
    }
  };

  const handleAction = async (
    action: () => Promise<unknown>,
    successMsg: string
  ) => {
    try {
      await action();
      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
      toast.success(successMsg);
    } catch {
      toast.error('Action failed');
    }
  };

  if (!room) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white p-6 overflow-hidden safe-area-inset font-black uppercase">
      <header className="flex items-center justify-between mb-8 pb-4 brutal-border border-x-0 border-t-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-retro-yellow brutal-border">
            <Smartphone className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-black truncate max-w-[120px]">{slug}</h1>
            <p className="text-[10px] text-black opacity-60">
              {nickname}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {room.status === 'voting' && (
            <div className="brutal-border bg-white px-2 py-1">
              <RoundTimer
                roomId={room._id}
                identityId={identityId!}
                timerStartedAt={room.timerStartedAt}
                isFacilitator={isFacilitator}
              />
            </div>
          )}
          <button
            onClick={onExit}
            className="brutal-btn p-3 bg-white text-black"
            aria-label="Exit Controller"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center py-4">
        {activeTopic ? (
          <div className="w-full bg-grid p-6 brutal-border bg-white brutal-shadow">
            <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 brutal-border mb-6 inline-block ${
              room.status === 'voting' ? 'bg-retro-blue text-black' : 'bg-retro-green text-black'
            }`}>
              {room.status === 'voting' ? '🤔 Voting' : '✅ Revealed'}
            </span>
            <h2 className="text-2xl font-black mb-2 leading-tight">
              {activeTopic.title}
            </h2>
            <p className="text-sm font-bold opacity-60 mt-4">
              {myVote ? `Your vote: ${myVote}` : 'Ready to vote?'}
            </p>
          </div>
        ) : (
          <div className="text-center bg-white brutal-border p-8 brutal-shadow">
            <h2 className="text-xl font-black text-black opacity-40 mb-8 italic">
              No active topic
            </h2>
            {isFacilitator && (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      nextTopic({ roomId: room._id, identityId: identityId! }),
                    'Round started!'
                  )
                }
                className="brutal-btn w-64 py-5 bg-retro-green text-black text-lg"
              >
                <Play className="fill-current w-5 h-5" />
                Start Round
              </button>
            )}
          </div>
        )}

        {isFacilitator && activeTopic && (
          <div className="grid grid-cols-2 gap-4 w-full mt-10 mb-8">
            {room.status === 'voting' ? (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      revealVotes({
                        roomId: room._id,
                        identityId: identityId!,
                      }),
                    'Votes revealed!'
                  )
                }
                className="brutal-btn py-4 bg-retro-blue text-black"
              >
                <Eye className="w-5 h-5" />
                Reveal
              </button>
            ) : (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      nextTopic({ roomId: room._id, identityId: identityId! }),
                    'Topic advanced!'
                  )
                }
                className="brutal-btn py-4 bg-retro-yellow text-black"
              >
                <Play className="fill-current w-5 h-5" />
                Next
              </button>
            )}
            <button
              onClick={() =>
                handleAction(
                  () =>
                    resetRound({ roomId: room._id, identityId: identityId! }),
                  'Round reset!'
                )
              }
              className="brutal-btn py-4 bg-white text-black"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        )}
      </main>

      <div className="mt-auto p-4 bg-white brutal-border brutal-shadow">
        <div className="text-[8px] font-black tracking-widest opacity-40 mb-3 text-center">
          — SELECT YOUR ESTIMATE —
        </div>
        <CardDeck
          onSelect={handleVote}
          selectedVote={myVote}
          isController
          scaleType={room.scaleType}
        />
      </div>

      <div className="fixed bottom-32 right-4 z-50">
        <EmojiActionBar
          onSelect={(emoji) => {
            // Placeholder for emoji reaction logic
            if (window.navigator.vibrate) window.navigator.vibrate(20);
          }}
        />
      </div>
    </div>
  );
}
