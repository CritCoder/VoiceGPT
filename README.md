# Distinct Frame Extraction

A Next.js application for extracting distinct frames from videos with AI-powered analysis and narration generation.

## Features

- Extract distinct frames from videos using dHash and SSIM algorithms
- AI-powered frame analysis using OpenAI GPT-4 Vision
- Automatic script generation from frame analyses
- Text-to-speech audio generation using ElevenLabs
- Modern UI built with Next.js, TypeScript, and shadcn/ui

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

3. Run the development server:
```bash
yarn dev
```

## Usage

1. Upload a video file from your computer
2. Configure extraction parameters (sampling interval, dHash threshold, SSIM threshold)
3. Click "Extract Distinct Frames" to process the video
4. Select frames for analysis
5. Set your analysis prompt
6. Click "Process Frames" to generate AI analysis and a narration script
7. Generate the narration audio and then merge it with your original video to download a final MP4 with voiceover

## API Endpoints

- `/api/analyze-frame` - Analyze individual frames with AI
- `/api/generate-script` - Generate narration script from frame analyses
- `/api/generate-audio` - Convert script to speech using ElevenLabs
- `/api/merge-av` - Merge generated audio with the original uploaded video (audio length is time-aligned to video)
