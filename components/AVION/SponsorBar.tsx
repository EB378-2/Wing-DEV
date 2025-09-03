import React, { useRef, useEffect } from 'react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
}

interface SponsorCarouselProps {
  speed?: number; // in pixels per second
  sponsors: Sponsor[];
}

const SponsorCarousel: React.FC<SponsorCarouselProps> = ({ speed = 50, sponsors }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth / 2; // half, because content is duplicated
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const distance = (speed * elapsed) / 1000; // pixels scrolled
      container.scrollLeft = distance % scrollWidth; // seamless loop
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [speed, sponsors]);

  // Duplicate sponsors for seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="relative w-full overflow-hidden py-8 bg-black">
      {/* Gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      <div ref={containerRef} className="flex whitespace-nowrap">
        {duplicatedSponsors.map((sponsor, idx) => (
          <div key={`${sponsor.id}-${idx}`} className="inline-flex items-center justify-center mx-8 flex-shrink-0">
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-105 opacity-80 hover:opacity-100"
              aria-label={`Visit ${sponsor.name}`}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-16 w-auto object-contain"
                loading="lazy"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorCarousel;
