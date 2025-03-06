// Central color configuration that reads from CSS variables but provides actual values for MUI

// Helper function to get computed CSS variable value
function getCssVariable(varName: string): string {
  if (typeof window !== 'undefined') {
    // We're in the browser
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  // Server-side rendering fallback values
  const cssVarDefaults: Record<string, string> = {
    '--primary': '#0066FF',
    '--error': '#940900',
    '--success': '#21DC11',
    '--background': '#FFFFFF',
    '--background-paper': '#FFFFFF',
    '--text-primary': '#000000',
    '--text-secondary': '#757575', 
  };
  return cssVarDefaults[varName] || '';
}

// These values will be used directly by MUI
export const getMuiColors = (isDarkMode: boolean) => ({
  primary: getCssVariable('--primary'),
  error: getCssVariable('--error'),
  success: getCssVariable('--success'),
  background: {
    default: isDarkMode 
      ? getCssVariable('--background') 
      : getCssVariable('--background'),
    paper: isDarkMode 
      ? getCssVariable('--background-paper') 
      : getCssVariable('--background-paper'),
  },
  text: {
    primary: isDarkMode 
      ? getCssVariable('--text-primary') 
      : getCssVariable('--text-primary'),
    secondary: isDarkMode 
      ? getCssVariable('--text-secondary') 
      : getCssVariable('--text-secondary'),
  },
});

// These CSS variable references will be used by Tailwind and CSS
export const colors = {
  primary: 'var(--primary)',
  error: 'var(--error)',
  success: 'var(--success)',
  light: {
    background: {
      default: 'var(--background)',
      paper: 'var(--background-paper)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
  },
  dark: {
    background: {
      default: 'var(--background)',
      paper: 'var(--background-paper)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
  },
};

export default colors; 