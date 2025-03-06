'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes';
import { getMuiColors } from './colors';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = resolvedTheme === 'dark';

  // Create a theme instance with default values for SSR
  const createMuiTheme = () => {
    const muiColors = getMuiColors(isDarkMode);
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: muiColors.primary,
        },
        error: {
          main: muiColors.error,
        },
        success: {
          main: muiColors.success,
        },
        background: {
          default: muiColors.background.default,
          paper: muiColors.background.paper,
        },
        text: {
          primary: muiColors.text.primary,
          secondary: muiColors.text.secondary,
        },
      },
      components: {
        MuiButton: {
          defaultProps: {
            variant: "outlined",
            color: "primary",
          },
          styleOverrides: {
            root: {
              borderWidth:"0.5px",
              borderRadius: '50px',
              textTransform: "capitalize",
              '&': {
                textTransform: "capitalize"
              }
            }
          }
        },
        MuiTextField:{
          defaultProps:{
            variant:"outlined",
            color:"primary",
            InputProps:{
              sx:{
                borderRadius:"18px"
              }
            }
          },
          
        }
      }
    });
  };

  // Initial theme
  const [theme, setTheme] = useState(createMuiTheme());

  // Update theme when CSS variables change
  useEffect(() => {
    const updateTheme = () => {
      setTheme(createMuiTheme());
    };

    // Update theme when mounted and when theme changes
    if (mounted) {
      updateTheme();
    }

    // Optional: Listen for CSS variable changes
    // This is advanced and might not be necessary in most cases
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style' &&
          mutation.target === document.documentElement
        ) {
          updateTheme();
        }
      });
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, { attributes: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [mounted, resolvedTheme]);

  // To avoid hydration mismatch, only show the theme after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
} 