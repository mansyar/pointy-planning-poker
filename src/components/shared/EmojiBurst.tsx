import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FloatingEmoji } from '../../hooks/useEmojiReactions';

interface EmojiItemProps {
  reaction: FloatingEmoji;
}

function EmojiItem({ reaction }: EmojiItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Find the player card element
    const element = document.querySelector(
      `[data-player-id="${reaction.senderId}"]`
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      setStartPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Fallback to center if element not found
      setStartPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [reaction.senderId]);

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        style={{ left: startPos.x, top: startPos.y }}
        className="fixed text-4xl -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        {reaction.emoji}
      </motion.div>
    );
  }

  // Random burst direction
  const angle = Math.random() * Math.PI * 2;
  const distance = 80 + Math.random() * 80;
  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance - 80; // Prefer upwards

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        rotate: 0,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1.2, 0],
        x: targetX,
        y: targetY,
        rotate: Math.random() * 360,
      }}
      style={{ left: startPos.x, top: startPos.y }}
      transition={{
        duration: 2,
        ease: 'easeOut',
      }}
      className="fixed text-4xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden="true"
    >
      {reaction.emoji}
    </motion.div>
  );
}

export function EmojiBurst({ reactions }: { reactions: FloatingEmoji[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {reactions.map((r) => (
        <EmojiItem key={r.id} reaction={r} />
      ))}
    </div>
  );
}
