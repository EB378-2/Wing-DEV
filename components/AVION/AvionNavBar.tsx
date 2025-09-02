"use client";

import React, { useState } from 'react';
import { 
    Container,
    Box,
    Typography,
    Grid, 
    IconButton,
    Drawer,
    List,
    ListItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

export default function AvionNavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Navigation items
  const navItems = [
    { label: 'EVENTS', href: '/avion' },
    { label: 'TEAMS & PILOTS', href: '/avion' },
    { label: 'CIRCUITS', href: '/avion' },
    { label: 'NEWS', href: '/avion' },
    { label: 'SHOP', href: '/avion' }
  ];

  // Drawer component for mobile view
  const drawer = (
    <Box 
      onClick={() => setDrawerOpen(false)} 
      sx={{ 
        textAlign: 'center', 
        background: '#000', 
        height: '100%',
        pt: 2,
        position: 'sticky',
        top: 0
      }}
    >
      <Image 
        src="/a1_branding/a1_logo_neon.jpeg" 
        alt="Avion One" 
        width={80} 
        height={20} 
        style={{ marginBottom: '20px' }}
      />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <Link href={item.href} passHref style={{ width: '100%', textDecoration: 'none' }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontFamily: 'var(--font-good-times), sans-serif', 
                  color: 'white',
                  py: 2,
                  ":hover": { textDecoration: 'underline' },
                  textAlign: 'center'
                }}
              >
                {item.label}
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        backgroundColor: '#000000',
        py: { xs: 1, md: 0 },
        zIndex: 1000,
        position: 'sticky',
        top: 0
      }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {/* Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: 60, sm: 70, md: 80 },
            height: 'auto'
          }}>
            <Image 
              src="/a1_branding/a1_logo_neon.jpeg" 
              alt="Avion One" 
              width={80} 
              height={20}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center',
              gap: { xs: 1, sm: 2, md: 3, lg: 4 }
            }}>
              {navItems.map((item) => (
                <Typography 
                  key={item.label} 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontFamily: 'var(--font-good-times), sans-serif', 
                    ":hover": { textDecoration: 'underline' },
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem', lg: '1rem' }
                  }}
                >
                  <Link href={item.href} style={{ color: 'white', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </Typography>
              ))}
            </Box>
          ) : (
            // Mobile menu button
            <IconButton
              aria-label="open menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            background: '#000',
            width: '70%',
            maxWidth: 300
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}