"use client";

import React from 'react';
import { 
    Container,
    Box,
    Typography, 
} from '@mui/material';
import AvionNavBar from '@/components/AVION/AvionNavBar';

export default function Home() {

  return (
    <Box sx={{ backgroundColor: '#000000ff', width: '100vw', minHeight: '100vh' }}>

      {/* AvionNavBar */}
      <AvionNavBar />
      
      {/* AvionHero */}
      <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh',  width: '100vw', backgroundColor: '#000000ff' }}>
        <div className="absolute inset-0 bg-[url(/a1_images/image.png)] bg-cover bg-center mask-t-from-20% mask-t-to-80% brightness-50 max-h-140" />
        <Container sx={{ position: "relative", flexGrow: 1, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom align="center" sx={{ color: '#ffffffff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                AVION ONE
            </Typography>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#02b7ffff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif', textDecoration: 'outline' }}>
                DEFY GRAVITY. REDEFINE SPEED.
            </Typography>
        </Container>
      </Box>
      

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ea0000ff', width: '100vw', minHeight: '15vh' }}>
        Sponsors
      </Box>
      
      {/* The New Era of Racing */}
      <Box sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh', backgroundColor: '#ffffffff', width: '100vw' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#000000ff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                The New Era of Racing
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#000000ff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                Experience the thrill of cutting-edge technology and unparalleled speed with Avion One, the pinnacle of modern racing innovation.
            </Typography>
        </Container>
      </Box>

      {/* The Vision, The Dream, The Race */}

      <Box sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh', backgroundColor: '#000000ff', width: '100vw' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#ffffffff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                The Vision, The Dream
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#02b7ffff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                At Avion One, we envision a future where speed meets sustainability, and innovation drives performance. Join us on this exhilarating journey as we push the boundaries of what's possible in the world of racing.
            </Typography>
        </Container>
      </Box>

      {/* The Basic Idea and Rules */}

      <Box sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh', backgroundColor: '#ffffffff', width: '100vw' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#000000ff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                The Basic Idea and Rules
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#000000ff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                Avion One is designed to challenge the limits of speed and agility. Our team has meticulously crafted a set of rules that prioritize safety, innovation, and competitive spirit, ensuring that every
            </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ea0000ff', width: '100vw', minHeight: '10vh' }}>
        Footer
      </Box>
    </Box>
  );
}