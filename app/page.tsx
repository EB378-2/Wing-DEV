"use client";

import React from 'react';
import { 
  Container, 
  Typography, 
} from '@mui/material';
import Link from 'next/link';

export default function Home() {


  return (
    <>
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center">
          Welcome EAB!
      </Typography>
      <Link href="/home">
        Marshal Protocol
      </Link>
    </>
  );
}