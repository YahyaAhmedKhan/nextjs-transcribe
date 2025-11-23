import fs from "fs";
import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();


class Transcribe {
    private static groq = new Groq();

    static async transcribeAudio(filePath: string): Promise<string> {
        const transcription = await Transcribe.groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath), // Required path to audio file - replace with your audio file!
            model: "whisper-large-v3-turbo", // Required model to use for transcription

        });
        return transcription.text;
    }
}

export default Transcribe;

Transcribe.transcribeAudio("aud.ogg").then((text) => {
    console.log("Transcribed Text:", text);
}).catch((error) => {
    console.error("Error during transcription:", error);
});