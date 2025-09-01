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
      <Link href="/airport">
        Airport
      </Link><br />
      <Link href="/mp">
        MP
      </Link><br />
      <Link href="/avion">
        Avion 1
      </Link>
    </>
  );
}