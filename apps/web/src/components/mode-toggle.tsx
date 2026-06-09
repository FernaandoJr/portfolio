'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={cn('cursor-pointer', className)}>
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <motion.div
        className="flex items-center justify-center"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeOut', type: 'spring', bounce: 0.1 }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
        <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
