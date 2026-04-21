import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type ReactNode } from 'react';

interface PokerCardProps {
  value: string | number;
  selected?: boolean;
  disabled?: boolean;
  revealed?: boolean;
  onSelect: (value: string | number) => void;
  children?: ReactNode;
  [key: string]: unknown;
}

export function PokerCard({
  value,
  selected,
  disabled,
  revealed = true,
  onSelect,
  ...props
}: PokerCardProps) {
  return (
    <motion.div
      onClick={() => !disabled && onSelect(value)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(value);
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={selected}
      aria-label={`Vote ${value}`}
      {...props}
      whileTap={!disabled ? { scale: 0.98, translate: '2px 2px' } : {}}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 brutal-border cursor-pointer
        flex items-center justify-center text-3xl sm:text-4xl font-black
        transition-all duration-75 outline-none brutal-shadow
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''}
        ${
          selected
            ? 'bg-retro-yellow translate-x-1 translate-y-1 shadow-none'
            : 'bg-white hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-md'
        }
      `}
    >
      {revealed ? (
        <span className="uppercase">{value}</span>
      ) : (
        <div className="w-full h-full bg-grid flex items-center justify-center">
          <div className="w-10 h-14 brutal-border bg-black/10" />
        </div>
      )}
    </motion.div>
  );
}
