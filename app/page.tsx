'use client';

import { useState } from 'react';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import TranscriptionService from '@/services/TranscriptionService';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SoundToggle } from '@/components/sound-toggle';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('/sounds/notif.mp3');
      audio.volume = 0.03;
      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        // Fallback to system notification sound
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Transcription Complete');
        }
      });
    } catch (err) {
      console.error('Audio creation failed:', err);
    }
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAudioFile(file);
      setTranscription('');
      setError('');
      
      // Automatically start transcription if enabled
      if (autoTranscribe) {
        setLoading(true);
        try {
          const text = await TranscriptionService.transcribeAudio(file);
          setTranscription(text);
          // Play chime and show success toast with file name and preview
          playChime();
          const preview = text.slice(0, 50) + (text.length > 50 ? '...' : '');
          toast.success('Transcription Complete', {
            description: `${file.name}\n"${preview}"`,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setLoading(true);
    setError('');
    setTranscription('');

    try {
      const text = await TranscriptionService.transcribeAudio(audioFile);
      setTranscription(text);
      // Play chime and show success toast with file name and preview
      playChime();
      const preview = text.slice(0, 50) + (text.length > 50 ? '...' : '');
      toast.success('Transcription Complete', {
        description: `${audioFile.name}\n"${preview}"`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <SoundToggle enabled={soundEnabled} onToggle={setSoundEnabled} />
      </div>
      <main className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Audio Transcription
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Upload an audio file to transcribe it to text
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm text-black dark:text-zinc-50">
                Auto-transcribe on upload
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {autoTranscribe ? 'Transcription starts automatically' : 'Use button to transcribe'}
              </span>
            </div>
            <Switch
              checked={autoTranscribe}
              onCheckedChange={setAutoTranscribe}
            />
          </div>

          <Dropzone
            accept={{
              'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
            }}
            maxSize={25 * 1024 * 1024} // 25MB
            onDrop={handleDrop}
            src={audioFile ? [audioFile] : undefined}
            className="min-h-[200px]"
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          {audioFile && !autoTranscribe && (
            <Button
              onClick={handleTranscribe}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Transcribing...' : 'Transcribe Audio'}
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {transcription && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold text-lg text-black dark:text-zinc-50">
              Transcription
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {transcription}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
