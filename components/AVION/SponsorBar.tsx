import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Logo type
interface Logo {
  src: string;
  alt: string;
}

// Props for component
interface InfiniteScrollingLogosProps {
  speed?: number; // duration in seconds
  gap?: number; // gap between logos in px
}

const logos = [
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Acme' },
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Quantum' },
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Echo' },
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Celestial' },
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Pulse' },
  { src: '/a1_branding/a1_logo_neon.jpeg', alt: 'Apex' },
];

const SponsorCarousel: React.FC<InfiniteScrollingLogosProps> = ({
  speed = 10,
  gap = 64,
}) => {
  // Duplicate logos array to create seamless infinite loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-4 bg-black">

      {/* Gradient masks */}
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Motion container */}
        <motion.div
          className="flex whitespace-nowrap"
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: speed,
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className={`flex-none`}
              style={{ marginRight: gap }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={32}
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SponsorCarousel;