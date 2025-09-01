"use client";

import React from 'react';
import { 
    Container,
    Box,
    Typography, 
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function AvionNavBar() {


  return (
    <Box sx={{ width: '100vw', display: 'flex', flexDirection: 'row', backgroundColor: '#000000ff'}}>
        <Box sx={{ mx: 4 }}>
            <Image src="/a1_branding/a1_logo_neon.jpeg" alt="Avion One" width={80} height={10} />
        </Box>
        <Container maxWidth="lg" sx={{ pt: 3, pb: 3, display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ mx: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                <Typography variant="h6" component="div" sx={{ fontFamily: 'var(--font-good-times), sans-serif', ":hover": { textDecoration: 'underline' } }}>
                    <Link href="/avion">EVENTS</Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontFamily: 'var(--font-good-times), sans-serif', ":hover": { textDecoration: 'underline' } }}>
                    <Link href="/avion">TEAMS & PILOTS</Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontFamily: 'var(--font-good-times), sans-serif', ":hover": { textDecoration: 'underline' } }}>
                    <Link href="/avion">CIRCUITS</Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontFamily: 'var(--font-good-times), sans-serif', ":hover": { textDecoration: 'underline' } }}>
                    <Link href="/avion">NEWS</Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontFamily: 'var(--font-good-times), sans-serif', ":hover": { textDecoration: 'underline' } }}>
                    <Link href="/avion">SHOP</Link>
                </Typography>
            </Box>
        </Container>
    </Box>
      
  );
}