import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Clipboard, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import { generateStandupSummary } from '../../utils/exporter';
import type { Doc } from '../../../convex/_generated/dataModel';

interface SummaryViewProps {
  roomId: Id<'rooms'>;
  identityId: string;
  roomSlug: string;
  entries: Doc<'standup_entries'>[];
  players: Doc<'players'>[];
  onBack: () => void;
}

export function SummaryView({
  roomId,
  identityId,
  roomSlug,
  entries,
  players,
  onBack,
}: SummaryViewProps) {
  const parkingLotItems = useQuery(api.parkingLot.listByRoom, { roomId });
  const resetStandup = useMutation(api.standup.reset);

  const speakers = entries
    .filter(e => e.status === 'completed' || e.status === 'skipped')
    .map(e => ({
      name: players.find(p => p.identityId === e.identityId)?.name || 'Unknown',
      duration: e.duration || 0,
      status: e.status
    }));

  const handleCopyMarkdown = () => {
    const markdown = generateStandupSummary(
      roomSlug,
      speakers,
      parkingLotItems?.map(i => i.text) || []
    );
    
    navigator.clipboard.writeText(markdown);
    toast.success('Summary copied to clipboard!');
  };

  const handleEndSession = async () => {
    try {
      await resetStandup({
        roomId,
        identityId,
      });
      toast.success('Session ended');
    } catch {
      toast.error('Failed to end session');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white brutal-border brutal-shadow-lg p-8 sm:p-12 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">
          Standup Summary
        </h2>
        <button
          onClick={onBack}
          className="p-3 brutal-border hover:bg-retro-yellow transition-all"
          title="Back to View"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="grid gap-12 sm:grid-cols-2">
        {/* Durations */}
        <section>
          <div className="flex items-center gap-2 mb-6 bg-black text-white px-3 py-1.5 brutal-border w-fit">
            <h3 className="text-sm font-black uppercase tracking-widest">
              🎙️ Speaker Stats
            </h3>
          </div>
          <div className="space-y-3">
            {speakers.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 brutal-border bg-white">
                <span className="font-bold text-sm uppercase">{s.name}</span>
                <span className={`font-black text-sm ${s.status === 'skipped' ? 'text-gray-400 italic' : ''}`}>
                  {s.status === 'skipped' ? 'SKIPPED' : `${s.duration}S`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Parking Lot */}
        <section>
          <div className="flex items-center gap-2 mb-6 bg-retro-pink text-black px-3 py-1.5 brutal-border w-fit">
            <h3 className="text-sm font-black uppercase tracking-widest">
              🚗 Parking Lot
            </h3>
          </div>
          <div className="space-y-3">
            {parkingLotItems?.length === 0 ? (
              <p className="text-sm font-bold uppercase opacity-40 italic">No items recorded.</p>
            ) : (
              parkingLotItems?.map((item) => (
                <div key={item._id} className="p-3 brutal-border bg-white text-sm font-bold uppercase">
                  {item.text}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row gap-6">
        <button
          onClick={handleCopyMarkdown}
          className="flex-[2] py-5 bg-retro-green text-black text-2xl font-black uppercase brutal-border brutal-shadow transition-all flex items-center justify-center gap-3 hover:bg-green-400"
        >
          <Clipboard className="w-8 h-8" />
          Copy Markdown
        </button>
        
        <button
          onClick={handleEndSession}
          className="flex-1 py-5 bg-white text-black text-xl font-black uppercase brutal-border brutal-shadow transition-all flex items-center justify-center gap-3 hover:bg-gray-100"
        >
          <LayoutDashboard className="w-6 h-6" />
          End Session
        </button>
      </div>
    </div>
  );
}
