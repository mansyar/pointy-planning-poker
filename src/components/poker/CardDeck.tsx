import { PokerCard } from './PokerCard';

interface CardDeckProps {
  onSelect: (value: string | number) => void;
  selectedVote?: string | number | null;
  isController?: boolean;
  scaleType?: 'fibonacci' | 'tshirt';
}

const FIBONACCI_VALUES = [0, 1, 2, 3, 5, 8, 13, 21, '?', '☕'];
const TSHIRT_VALUES = ['XS', 'S', 'M', 'L', 'XL', '?', '☕'];

export function CardDeck({
  onSelect,
  selectedVote,
  isController = false,
  scaleType = 'fibonacci',
}: CardDeckProps) {
  const deckValues = scaleType === 'tshirt' ? TSHIRT_VALUES : FIBONACCI_VALUES;

  if (isController) {
    return (
      <div className="w-full">
        <h3 className="text-center text-[10px] font-black uppercase tracking-[0.2em] mb-4 bg-black text-white py-1 brutal-border">
          Cast your vote
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {deckValues.map((val) => (
            <button
              key={val}
              onClick={() => onSelect(val)}
              className={`aspect-square flex items-center justify-center brutal-border text-lg font-black transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none brutal-shadow ${
                selectedVote === val
                  ? 'bg-retro-yellow shadow-none translate-x-0.5 translate-y-0.5'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-retro-blue border-t-4 border-black p-6 sm:p-8 brutal-shadow">
      <div className="page-wrap max-w-5xl mx-auto">
        <h3 className="text-center text-xs font-black uppercase tracking-widest mb-8">
          — Choose your estimate —
        </h3>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {deckValues.map((val) => (
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
