import { PokerCard } from './PokerCard';

interface CardDeckProps {
  onSelect: (value: string | number) => void;
  selectedVote?: string | number | null;
}

const DECK_VALUES = [0, 1, 2, 3, 5, 8, 13, 21, '?', '☕'];

export function CardDeck({ onSelect, selectedVote }: CardDeckProps) {
  return (
    <div className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-sm border-t border-[var(--border-subtle)] p-6 sm:p-8">
      <div className="page-wrap max-w-5xl mx-auto">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">
          Choose your estimate
        </h3>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {DECK_VALUES.map((val) => (
            <PokerCard
              key={val}
              value={val}
              selected={selectedVote === val}
              onSelect={onSelect}
              data-testid="poker-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
