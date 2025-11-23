'use client';

import { useState } from 'react';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import TranscriptionService from '@/services/TranscriptionService';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAudioFile(acceptedFiles[0]);
      setTranscription('');
      setError('');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
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
          <Dropzone
            accept={{
              'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
            }}
            maxSize={25 * 1024 * 1024} // 25MB
            onDrop={handleDrop}
            className="min-h-[200px]"
          >
            <DropzoneEmptyState />
            <DropzoneContent src={audioFile ? [audioFile] : undefined} />
          </Dropzone>

          {audioFile && (
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
