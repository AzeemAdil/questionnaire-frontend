'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {resolvedTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
} 