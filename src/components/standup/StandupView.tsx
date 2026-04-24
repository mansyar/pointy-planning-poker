import { ActiveSpeakerCard } from './ActiveSpeakerCard';
import { ParkingLot } from './ParkingLot';
import { SummaryView } from './SummaryView';
import { useState } from 'react';
import type { Id, Doc } from '../../../convex/_generated/dataModel';

interface StandupViewProps {
  roomId: Id<'rooms'>;
  identityId: string;
  isFacilitator: boolean;
  entries: Doc<'standup_entries'>[];
  players: Doc<'players'>[];
  timeLimit: number;
  roomSlug: string;
}

export function StandupView({
  roomId,
  identityId,
  isFacilitator,
  entries,
  players,
  timeLimit,
  roomSlug,
}: StandupViewProps) {
  const [showSummary, setShowSummary] = useState(false);
  
  const currentEntry = entries.find((e) => e.status === 'speaking');
  const activePlayer = currentEntry 
    ? players.find(p => p.identityId === currentEntry.identityId)
    : null;

  // If no one is speaking and we have entries, standup is done
  const isFinished = !currentEntry && entries.length > 0;

  if (showSummary || isFinished) {
    return (
      <SummaryView
        roomId={roomId}
        roomSlug={roomSlug}
        entries={entries}
        players={players}
        onBack={() => setShowSummary(false)}
      />
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
      
      {/* Parking Lot Summary */}
      <div className="mt-12 w-full max-w-4xl h-64 shrink-0">
         <ParkingLot 
           roomId={roomId}
           identityId={identityId}
           isFacilitator={isFacilitator}
         />
      </div>
    </div>
  );
}
