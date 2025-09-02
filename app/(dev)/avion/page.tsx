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
    <>

      {/* AvionNavBar */}
      <AvionNavBar />
      
      {/* AvionHero */}
      <Box sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh', backgroundImage: 'url(a1_images/image.png)', backgroundSize: '100vw',  width: '100vw', maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.7), rgba(0,0,0,0))', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: '#000000ff' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#ffffffff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                AVION ONE
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#02b7ffff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                DEFY GRAVITY. REDEFINE SPEED.
            </Typography>
        </Container>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ea0000ff', width: '100vw', minHeight: '10vh' }}>
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
    </>
  );
}