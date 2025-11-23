'use client';

import * as React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onToggle(!enabled)}
      className="h-9 w-9 border-zinc-300 dark:border-zinc-700"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle sound</span>
    </Button>
  );
}
