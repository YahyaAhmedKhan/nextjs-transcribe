class TranscriptionService {
  private static getBackendUrl(): string {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    
    // Remove trailing slash to prevent double slashes
    return url.replace(/\/+$/, '');
  }

  /**
   * Transcribe an audio file using the backend API
   * @param audioFile - The audio file to transcribe
   * @param translate - Whether to translate to English
   * @returns Promise with the transcription text
   */
  static async transcribeAudio(audioFile: File, translate: boolean = false): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (translate) {
      formData.append('language', 'english');
    }

    const response = await fetch(`${this.getBackendUrl()}/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to transcribe audio' }));
      throw new Error(error.message || `Transcription failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Transcription was not successful');
    }

    return data.transcription;
  }
}

export default TranscriptionService;
