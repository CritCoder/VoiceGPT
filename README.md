# 🎙️ VoiceGPT

**Transform any video into an AI-narrated explainer in 10+ languages with perfect audio-video sync**

VoiceGPT is a Next.js application that uses Google Gemini AI and ElevenLabs to automatically analyze videos, generate natural narration scripts in multiple languages, and create professional voice-overs with perfect synchronization.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

### 🌍 Multi-Language Support
- **10+ Languages**: English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, Arabic
- **Native Script Generation**: Gemini AI generates transcripts directly in your selected language
- **No Translation**: Authentic content created natively in each language

### 🎤 Voice Selection & Preview
- **Browse All Voices**: Access all ElevenLabs voices with detailed metadata
- **Live Preview**: Test any voice before selection with language-specific sample text
- **Voice Details**: See gender, accent, age, and use case recommendations
- **Smart Filtering**: Voices optimized for each language

### ⏱️ Perfect Audio-Video Sync
- **Automatic Duration Detection**: Detects video length on upload
- **Duration-Aware AI**: Gemini generates content that fits your video length
- **Smart Time-Stretching**: FFmpeg automatically adjusts audio to match video perfectly
- **No Manual Editing**: Everything happens automatically

### 🎨 Beautiful User Interface
- **Step-by-Step Wizard**: Guided 5-step process
- **Tab-Based Configuration**: Easy video, language, and voice selection
- **Real-Time Preview**: Preview voices and audio before finalizing
- **Visual Feedback**: Progress bars, loading states, and clear indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Yarn
- Google Gemini API Key ([Get it here](https://ai.google.dev/))
- ElevenLabs API Key ([Get it here](https://elevenlabs.io/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CritCoder/VoiceGPT.git
cd VoiceGPT
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp env.template .env
```

Edit `.env` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. **Run the development server**
```bash
yarn dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 📖 How It Works

### 1. Upload & Configure
- Upload your video (MP4, MOV, AVI, etc.)
- Describe what you want to explain
- Select your target language (e.g., Hindi 🇮🇳)
- Preview and choose a voice

### 2. AI Analysis
- **Gemini AI** analyzes your entire video
- Understands context, scenes, and content
- Generates natural, engaging script in your selected language
- Creates timestamps for the narration

### 3. Audio Generation
- **ElevenLabs** creates professional voice-over
- Uses your selected voice and language
- Natural-sounding speech with proper pronunciation
- High-quality MP3 output (44.1kHz, 128kbps)

### 4. Perfect Sync
- **FFmpeg** merges audio with video
- Automatically stretches/compresses audio to match video duration
- Maintains natural pitch and quality
- Exports final video with perfect synchronization

### 5. Download
- Download your AI-narrated video
- Professional quality output
- Ready to share or publish

## 🎯 Use Cases

- 📚 **Educational Videos**: Add narration to tutorials and lessons
- 💼 **Product Demos**: Create professional product explainers
- 🎬 **Video Essays**: Transform screen recordings into polished content
- 🌐 **Multi-language Content**: Create the same video in multiple languages
- 📱 **Social Media**: Add engaging narration to social content
- 🎓 **E-Learning**: Create course materials with professional voice-overs

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type safety

### AI Services
- **Google Gemini 2.0 Flash** - Video analysis and script generation
- **ElevenLabs API** - Natural voice generation with multilingual support

### Video Processing
- **FFmpeg** - Video/audio merging and time-stretching
- **ffmpeg-static** - Bundled FFmpeg binary

### UI Components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## 📦 Project Structure

```
VoiceGPT/
├── app/
│   ├── api/
│   │   ├── analyze-video-gemini/  # Gemini video analysis
│   │   ├── generate-audio/        # ElevenLabs audio generation
│   │   ├── get-voices/            # Fetch available voices
│   │   ├── preview-voice/         # Voice preview generation
│   │   └── merge-av/              # FFmpeg video/audio merging
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── landing-page.tsx           # Landing page component
│   ├── video-analyzer.tsx         # Main video processing wizard
│   └── voice-selector.tsx         # Voice selection with preview
├── lib/
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

## 🌟 Key Features Explained

### Language-Specific Generation
VoiceGPT doesn't translate - it generates content natively in your target language. When you select Hindi, Gemini AI thinks in Hindi and creates authentic Hindi narration, not translated English.

### Duration Matching
The system uses a 3-part approach:
1. **Detection**: Automatically detects video duration on upload
2. **AI Awareness**: Gemini knows the video length and generates appropriate content
3. **Time-Stretching**: FFmpeg adjusts audio speed while maintaining pitch quality

### Voice Preview System
- Click "Preview Voice" to hear any voice
- Plays language-specific sample text
- Helps you choose the perfect voice for your content
- Works with all 10+ supported languages

## 📝 API Endpoints

### `POST /api/analyze-video-gemini`
Analyzes video with Gemini AI
- **Input**: Video file, prompt, language, duration
- **Output**: Transcript and timestamps in selected language

### `POST /api/generate-audio`
Generates voice-over audio
- **Input**: Text, voice ID, language, target duration
- **Output**: MP3 audio file

### `GET /api/get-voices`
Fetches available ElevenLabs voices
- **Output**: List of voices with metadata

### `POST /api/preview-voice`
Generates voice preview
- **Input**: Voice ID, sample text, language
- **Output**: Short preview audio

### `POST /api/merge-av`
Merges audio with video
- **Input**: Video file, audio file, durations
- **Output**: Final video with synchronized audio

## 🔧 Configuration

### Environment Variables
```env
# Required
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Optional
PORT=3000
```

### Supported Video Formats
- MP4, MOV, AVI, WebM, MKV, FLV
- Any format supported by HTML5 video and FFmpeg

### Audio Output Settings
- Format: MP3
- Sample Rate: 44.1 kHz
- Bitrate: 128 kbps
- Channels: Mono/Stereo

## 🐛 Troubleshooting

### Voice Preview Not Working
- Check internet connection
- Verify ElevenLabs API key
- Check browser console for errors

### Video Upload Fails
- Ensure video file is valid
- Check file size (recommended < 100MB)
- Try a different video format

### Audio Sync Issues
- System automatically handles sync
- If issues persist, check video duration detection
- Review console logs for FFmpeg errors

### Language Generation Issues
- Verify Gemini API key is valid
- Check that language is supported
- Review Gemini API quota

## 📚 Documentation

- [Features Guide](FEATURES.md) - Comprehensive feature documentation
- [Language & Duration Fix](LANGUAGE_DURATION_FIX.md) - Technical implementation details
- [API Reference](#api-endpoints) - Complete API documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for powerful video analysis
- **ElevenLabs** for natural voice generation
- **Next.js Team** for the amazing framework
- **FFmpeg** for video processing capabilities

## 🚧 Roadmap

- [ ] Voice cloning support
- [ ] Custom voice settings (speed, pitch, stability)
- [ ] Batch video processing
- [ ] More language support
- [ ] Background music integration
- [ ] Subtitle generation
- [ ] Video editing features
- [ ] Cloud storage integration

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/CritCoder/VoiceGPT/issues)
- Check [Documentation](FEATURES.md)
- Review [Troubleshooting](#troubleshooting)

## 🌐 Links

- **Live Demo**: Coming soon
- **GitHub**: https://github.com/CritCoder/VoiceGPT
- **Issues**: https://github.com/CritCoder/VoiceGPT/issues

---

**Made with ❤️ by the VoiceGPT Team**

*Transform your videos with the power of AI* 🎙️✨
