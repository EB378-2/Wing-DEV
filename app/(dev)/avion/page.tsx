"use client";

import React from 'react';
import { 
    Container,
    Box,
    Typography, 
} from '@mui/material';
import Image from 'next/image';
import AvionNavBar from '@/components/AVION/AvionNavBar';

export default function Home() {


  return (
    <>

      {/* AvionNavBar */}
      <AvionNavBar />
      
      {/* AvionHero */}
      <Box sx={{ pt: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '60vh', backgroundColor: '#000000ff', width: '100vw' }}>
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#ffffffff', pt: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                AVION ONE
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#02b7ffff', pb: 2, fontFamily: 'var(--font-good-times), sans-serif' }}>
                DEFY GRAVITY. REDEFINE SPEED.
            </Typography>
        </Container>
      </Box>

    </>
  );
}