'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { SoundToggle } from '@/components/sound-toggle';
import { Home, BookOpen, Github } from 'lucide-react';

interface NavbarProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
}

export function Navbar({ soundEnabled, onSoundToggle }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-xl font-bold text-black dark:text-zinc-50 hover:opacity-80 transition-opacity"
            >
              Audio Transcribe
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Docs
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
          </div>
        </div>
      </div>
    </nav>
  );
}
