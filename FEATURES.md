# FrameCraft - Multi-Language AI Video Narration

## 🎉 New Features

### 1. Multi-Language Support
FrameCraft now supports 10+ languages for AI-narrated video generation:

- 🇬🇧 **English** - Full support with all voice options
- 🇮🇳 **Hindi** - Native Hindi narration with appropriate voices
- 🇪🇸 **Spanish** - Spanish language narration
- 🇫🇷 **French** - French language narration
- 🇩🇪 **German** - German language narration
- 🇵🇹 **Portuguese** - Portuguese language narration
- 🇨🇳 **Chinese** - Mandarin Chinese narration
- 🇯🇵 **Japanese** - Japanese language narration
- 🇰🇷 **Korean** - Korean language narration
- 🇸🇦 **Arabic** - Arabic language narration

### 2. Voice Selection with Live Preview
- Browse through all available ElevenLabs voices
- Preview any voice before selection with sample text in your chosen language
- See voice details including:
  - Gender
  - Accent
  - Age
  - Description
  - Use case recommendations

### 3. Enhanced Step-by-Step Workflow

#### Step 1: Upload & Configure (Enhanced)
The first step now includes three sub-steps:
1. **Video Upload** - Upload your video file
2. **Language Selection** - Choose your target language
3. **Voice Selection** - Browse and preview voices with live audio samples

#### Step 2: AI Analysis
- Shows complete configuration summary
- Displays selected language and voice
- Real-time progress tracking

#### Step 3: Transcript Review
- Review AI-generated transcript
- Edit if needed before audio generation

#### Step 4: Audio Preview
- Listen to generated audio with selected voice
- Shows language and voice information
- High-quality audio generation with ElevenLabs

#### Step 5: Final Video
- Download your complete AI-narrated video
- Video with perfect audio sync

## 🎤 Voice Features

### Voice Preview System
- **Live Preview**: Click "Preview Voice" to hear how each voice sounds
- **Sample Text**: Automatically uses appropriate sample text in your selected language
- **Stop Controls**: Stop preview at any time
- **Visual Feedback**: Clear indication of which voice is currently playing

### Voice Information
Each voice card displays:
- Voice name
- Gender classification
- Accent information
- Age category
- Detailed description
- Use case suggestions

### Voice Customization
- All voices use the `eleven_multilingual_v2` model for best multi-language support
- Optimized audio format: MP3 at 44.1kHz, 128kbps
- Consistent quality across all languages

## 🛠️ Technical Implementation

### API Endpoints

#### `/api/get-voices` (GET)
Fetches all available voices from ElevenLabs
- Returns voice list with metadata
- Includes labels and descriptions

#### `/api/preview-voice` (POST)
Generates voice preview audio
```json
{
  "voiceId": "voice_id_here",
  "text": "Sample text in target language",
  "modelId": "eleven_multilingual_v2"
}
```

#### `/api/generate-audio` (POST) - Enhanced
Now accepts language and voice parameters
```json
{
  "text": "Transcript text",
  "voiceId": "selected_voice_id",
  "language": "language_code"
}
```

### Components

#### `voice-selector.tsx`
- Reusable voice selection component
- Integrated preview functionality
- Language-aware sample text
- Visual feedback for selection and playback

#### `video-analyzer.tsx` - Enhanced
- Multi-step configuration with tabs
- Language and voice state management
- Configuration summary display
- Enhanced user experience with visual indicators

## 🎨 UI/UX Improvements

### Modern Tab Interface
- Clean 3-step configuration process
- Progressive disclosure of options
- Disabled states for logical flow
- Visual active state indicators

### Language Selection
- Flag icons for quick identification
- Grid layout for easy browsing
- Clear selection highlighting
- Automatic voice reset on language change

### Voice Cards
- Responsive grid layout
- Hover effects for better interaction
- Tag system for voice attributes
- Integrated preview button

### Configuration Summary
- Shows all selected options at a glance
- Displayed in Step 2 before analysis
- Visible in Step 4 with audio

### Visual Feedback
- Loading spinners for async operations
- Progress bars for long-running tasks
- Success/error states
- Disabled states for validation

## 🚀 Usage Guide

### Basic Workflow

1. **Upload Your Video**
   - Click or drag-and-drop your video file
   - Describe what you want to explain

2. **Select Language**
   - Choose from 10+ supported languages
   - Language determines sample text for previews

3. **Choose Your Voice**
   - Browse all available voices
   - Click "Preview Voice" to hear samples
   - Select your preferred voice

4. **Analyze Video**
   - AI analyzes your video content
   - Generates contextual transcript

5. **Generate Audio**
   - AI creates narration in selected language
   - Uses your chosen voice
   - Professional quality output

6. **Download Video**
   - Get your final AI-narrated video
   - Audio perfectly synced with original video

## 📝 Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Supported Video Formats
- MP4
- MOV
- AVI
- WebM
- And more...

### Audio Output
- Format: MP3
- Sample Rate: 44.1 kHz
- Bitrate: 128 kbps
- Channels: Mono/Stereo (source dependent)

## 🔧 Advanced Features

### Error Handling
- Comprehensive API error handling
- User-friendly error messages
- Graceful fallbacks
- Network error detection

### Performance Optimization
- Lazy loading of voice list
- Optimized preview generation
- Efficient state management
- Minimal re-renders

### Accessibility
- Clear visual indicators
- Descriptive labels
- Keyboard navigation support
- Screen reader friendly

## 🌟 Best Practices

### Choosing a Voice
1. Listen to multiple voice previews
2. Consider your content type
3. Match voice tone to message
4. Test with your target audience

### Language Selection
1. Match your audience's language
2. Consider regional preferences
3. Test pronunciation with preview
4. Verify transcript quality

### Video Optimization
1. Use clear, high-quality video
2. Keep descriptions concise
3. Review transcript before generation
4. Test final output quality

## 🆘 Troubleshooting

### Voice Preview Not Working
- Check internet connection
- Verify ElevenLabs API key
- Try different voice
- Check browser console for errors

### Audio Generation Failed
- Ensure voice is selected
- Check transcript length (not too long)
- Verify API key permissions
- Check ElevenLabs API status

### Language Issues
- Verify language is supported
- Check text encoding
- Test with preview first
- Contact support if persistent

## 📦 Dependencies

### Core
- Next.js 15.5.4
- React 18.3.1
- TypeScript 5.7.2

### AI Services
- Google Generative AI (Gemini)
- ElevenLabs API (Voice Generation)

### UI Components
- Radix UI components
- Tailwind CSS
- Framer Motion
- Lucide React icons

## 🎯 Future Enhancements

- Voice cloning support
- Custom voice settings (speed, pitch, stability)
- Batch video processing
- More language support
- Voice emotion controls
- Background music integration

## 📄 License

See LICENSE file for details.

## 🤝 Support

For issues or questions:
- Check documentation
- Review error messages
- Test with different settings
- Contact support team

