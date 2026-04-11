"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PHOTOS = [
  {
    src: "/melissa-blouse.png",
    alt: "Mélissa P. — Diététicienne Diplômée d'État & Naturopathe",
    caption: "Diététicienne DE & Naturopathe — Guadeloupe",
  },
  {
    src: "/melissa-icebath.png",
    alt: "Mélissa pratiquant le bain de glace — longévité et biohacking",
    caption: "Bain de glace — Longévité & Biohacking",
  },
];

export function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % PHOTOS.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + PHOTOS.length) % PHOTOS.length), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  const photo = PHOTOS[current];

  return (
    <div
      className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {PHOTOS.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          className={`object-cover object-top transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <p className="text-white font-semibold text-lg">Mélissa P.</p>
        <p className="text-white/80 text-sm">{photo.caption}</p>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Photo précédente"
      >
        <ChevronLeft className="w-5 h-5 text-[#1a1a1a]" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Photo suivante"
      >
        <ChevronRight className="w-5 h-5 text-[#1a1a1a]" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
