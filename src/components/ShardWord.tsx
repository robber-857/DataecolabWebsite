import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';

// Original substitute. NOT the licensed React Bits Pro Shatter Type source.
// Each glyph is divided into six triangular shards with independent transforms.
const clips = [
  'polygon(0 0, 100% 0, 48% 35%)', 'polygon(0 0, 48% 35%, 0 65%)',
  'polygon(100% 0, 100% 65%, 48% 35%)', 'polygon(0 65%, 48% 35%, 52% 75%)',
  'polygon(100% 65%, 100% 100%, 0 100%, 52% 75%, 48% 35%)', 'polygon(0 65%, 52% 75%, 0 100%)',
];

export default function ShardWord() {
  const ref = useRef<HTMLButtonElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.7 });
  const reduced = useReducedMotion();
  const [replay, setReplay] = useState(0);
  const lastPlay = useRef(0);
  const play = () => {
    if (reduced || performance.now() - lastPlay.current < 900) return;
    lastPlay.current = performance.now(); setReplay(n => n + 1);
  };
  return <button ref={ref} className="shard-word" aria-label="Oversight — replay fragment animation"
    onClick={play} onPointerEnter={e => { if (e.pointerType === 'mouse') play(); }} data-effect="original-shard-assembly">
    <span className="sr-only">Oversight</span>
    <span aria-hidden="true" className="shard-letters">
      {'Oversight'.split('').map((letter, index) => <span className="shard-letter" key={index}>
        <span className="shard-size">{letter}</span>
        {clips.map((clip, shard) => <motion.span key={`${shard}-${replay}`} className="shard"
          style={{ clipPath: clip }}
          initial={reduced ? false : { x: (shard % 2 ? -1 : 1) * (12 + index * 2), y: (shard - 2) * 9, rotate: (shard - 3) * 6, opacity: 0 }}
          animate={seen ? { x: 0, y: 0, rotate: 0, opacity: 1 } : undefined}
          transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : index * 0.018 + shard * 0.012, ease: [0.16, 1, 0.3, 1] }}>
          {letter}
        </motion.span>)}
      </span>)}
    </span>
    <span className="shard-plus" aria-hidden="true">↗</span>
  </button>;
}
