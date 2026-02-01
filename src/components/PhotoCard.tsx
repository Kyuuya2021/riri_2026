'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type PhotoCardProps = {
  src: string;
  index: number;
  onOpen: (src: string) => void;
};

export default function PhotoCard({ src, index, onOpen }: PhotoCardProps) {
  const [random, setRandom] = useState({ x: 0, y: 0, rotate: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [dragLimit, setDragLimit] = useState(300);
  const didDragRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 640;
    const range = isNarrow ? 20 : 25;
    const rotRange = isNarrow ? 15 : 20;
    setDragLimit(isNarrow ? Math.min(120, window.innerWidth * 0.3) : 300);
    setRandom({
      x: Math.random() * range * 2 - range,
      y: Math.random() * range * 2 - range,
      rotate: Math.random() * rotRange * 2 - rotRange,
    });
  }, []);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -dragLimit, right: dragLimit, top: -dragLimit, bottom: dragLimit }}
      whileHover={{ scale: 1.05, zIndex: 100, cursor: 'grab' }}
      whileDrag={{ scale: 1.1, zIndex: 101, cursor: 'grabbing' }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
      onDragStart={() => { didDragRef.current = true; }}
      onDragEnd={() => {
        setTimeout(() => { didDragRef.current = false; }, 0);
      }}
      onDoubleClick={() => onOpen(src)}
      onTap={() => {
        if (!didDragRef.current) onOpen(src);
      }}
      className="absolute top-1/2 left-1/2 flex items-center justify-center"
      style={{
        marginTop: `${random.y}%`,
        marginLeft: `${random.x}%`,
        rotate: random.rotate,
      }}
    >
      <div className="relative bg-white/10 backdrop-blur-sm p-2 border border-white/20 shadow-2xl transition-colors hover:bg-white/20 max-w-[45vw] sm:max-w-none">
        <Image
          src={src}
          alt="memory"
          width={600}
          height={400}
          className="w-28 sm:w-40 md:w-60 h-auto object-contain pointer-events-none select-none block max-w-full"
          priority={index < 3}
        />
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/50" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/50" />
      </div>
    </motion.div>
  );
}
