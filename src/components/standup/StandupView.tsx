import { ActiveSpeakerCard } from './ActiveSpeakerCard';
import { CheckCircle, ClipboardList, LayoutDashboard } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';

interface StandupViewProps {
  roomId: Id<'rooms'>;
  identityId: string;
  isFacilitator: boolean;
  entries: any[];
  players: any[];
  timeLimit: number;
}

export function StandupView({
  roomId,
  identityId,
  isFacilitator,
  entries,
  players,
  timeLimit,
}: StandupViewProps) {
  const currentEntry = entries.find((e) => e.status === 'speaking');
  const activePlayer = currentEntry 
    ? players.find(p => p.identityId === currentEntry.identityId)
    : null;

  // If no one is speaking and we have entries, standup is done
  const isFinished = !currentEntry && entries.length > 0;

  if (isFinished) {
    return (
      <div className="bg-white brutal-border brutal-shadow-lg p-12 text-center max-w-2xl w-full rise-in">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-retro-green brutal-border brutal-shadow flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
        </div>
        <h2 className="text-5xl font-black mb-4 tracking-tighter">
          SYNC COMPLETE!
        </h2>
        <p className="text-sm font-bold mb-10 opacity-60">
          ALL VOICES HEARD. {isFacilitator ? 'REVIEW THE SUMMARY OR DISCUSS PARKING LOT ITEMS.' : 'WAITING FOR FACILITATOR TO WRAP UP.'}
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {/* Phase 4 Summary */}}
            className="w-full py-4 bg-retro-yellow text-black text-xl font-black brutal-border brutal-shadow transition-all uppercase flex items-center justify-center gap-3 hover:bg-yellow-400"
          >
            <ClipboardList className="w-6 h-6" />
            View Summary
          </button>
          
          <button
            className="w-full py-4 bg-white text-black text-xl font-black brutal-border brutal-shadow transition-all uppercase flex items-center justify-center gap-3 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-6 h-6" />
            Clear & Reset Room
          </button>
        </div>
      </div>
    );
  }

  if (!activePlayer || !currentEntry) {
    return (
       <div className="animate-pulse text-gray-500 font-black uppercase text-2xl">
         Synchronizing queue...
       </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <ActiveSpeakerCard
        roomId={roomId}
        identityId={identityId}
        isFacilitator={isFacilitator}
        timeLimit={timeLimit}
        speaker={{
          identityId: activePlayer.identityId,
          name: activePlayer.name,
          startedAt: currentEntry.startedAt,
        }}
      />
      
      {/* Parking Lot Summary (Sneak Peak for Phase 4) */}
      <div className="mt-12 w-full max-w-4xl opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-not-allowed">
         <div className="bg-black text-white p-2 brutal-border text-xs font-black uppercase inline-block -mb-1 ml-4 relative z-10">
           Parking Lot (Soon)
         </div>
         <div className="bg-white brutal-border p-4 h-24 flex items-center justify-center text-sm font-bold uppercase">
           Off-topic items will appear here
         </div>
      </div>
    </div>
  );
}
