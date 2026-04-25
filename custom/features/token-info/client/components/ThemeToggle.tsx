/**
 * CUSTOM: gptchina fork
 * Theme toggle component for token pricing page
 */

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme, Button } from '@librechat/client';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  );
};
