"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PremiumFrame } from '@/components/ui/premium-frame'
import { VideoAnalyzer } from '@/components/video-analyzer'
import Marquee from '@/components/ui/marquee'
import { hasSavedProgress, loadAppState, clearAppState } from '@/lib/storage'
import {
  Video,
  Brain,
  Zap,
  FileVideo,
  Upload,
  Wand2,
  Play,
  Sparkles,
  Film,
  Layers,
  Globe,
  Clock,
  Users,
  Check,
  Languages,
  Mic,
  Cpu,
  ChevronDown,
  RotateCcw
} from 'lucide-react'

const inspirationItems = [
  { icon: Video, text: "Educational Videos", color: "text-blue-500" },
  { icon: Film, text: "Tutorial Content", color: "text-green-500" },
  { icon: Brain, text: "AI Analysis", color: "text-yellow-500" },
  { icon: FileVideo, text: "Product Demos", color: "text-purple-500" },
  { icon: Layers, text: "Direct Video Analysis", color: "text-orange-500" },
  { icon: Wand2, text: "Auto Narration", color: "text-pink-500" },
  { icon: Play, text: "Video Explainers", color: "text-red-500" },
  { icon: Sparkles, text: "AI-Powered", color: "text-indigo-500" },
]

export function LandingPage() {
  const [showApp, setShowApp] = useState(false)
  const [lastMergedUrl, setLastMergedUrl] = useState<string | null>(null)
  const [hasSavedState, setHasSavedState] = useState(false)

  useEffect(() => {
    const loadState = async () => {
      try {
        // Check for legacy merged video URL
        const url = localStorage.getItem('framecraft:lastMergedVideoUrl')
        if (url) setLastMergedUrl(url)

        // Check if we have saved progress
        const savedProgress = hasSavedProgress()
        setHasSavedState(savedProgress)

        // Auto-restore if user was in the middle of something
        const savedState = await loadAppState()
        if (savedState.showApp) {
          setShowApp(true)
        }
      } catch (error) {
        console.error('Error loading saved state:', error)
      }
    }

    loadState()
  }, [])

  const clearPreview = () => {
    try {
      localStorage.removeItem('framecraft:lastMergedVideoUrl')
    } catch {}
    setLastMergedUrl(null)
  }

  const startNew = async () => {
    await clearAppState()
    setShowApp(true)
  }

  const continueProgress = () => {
    setShowApp(true)
  }

  if (showApp) {
    return <VideoAnalyzer />
  }

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-border">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">VoiceGPT</span>
            </div>
            <div className="flex items-center gap-3">
              {hasSavedState && (
                <>
                  <Button
                    onClick={continueProgress}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Continue Progress
                  </Button>
                  <Button
                    onClick={startNew}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start New
                  </Button>
                </>
              )}
              {!hasSavedState && (
                <Button
                  onClick={() => setShowApp(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Saved Progress Banner */}
      {hasSavedState && (
        <section className="py-6 px-6 bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Welcome Back!</h3>
                  <p className="text-sm text-muted-foreground">
                    You have saved progress. Continue where you left off or start fresh.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={continueProgress}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
                <Button
                  onClick={async () => {
                    if (confirm('Clear all saved progress and start fresh?')) {
                      await clearAppState()
                      setHasSavedState(false)
                    }
                  }}
                  variant="outline"
                >
                  Clear & Start Fresh
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered • 10+ Languages • Perfect Sync</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-foreground tracking-tight leading-[1.1]">
            Turn Any Video<br />
            Into an <span className="text-primary">AI-Narrated</span><br />
            Explainer
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your video and watch as AI analyzes content, generates natural scripts in any language,
            and creates professional voice-overs with perfect synchronization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => setShowApp(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg font-semibold"
            >
              <Upload className="w-5 h-5" />
              Get Started Free
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-border">
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">50+</div>
              <div className="text-sm text-muted-foreground">AI Voices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">5min</div>
              <div className="text-sm text-muted-foreground">Average Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Automated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Final Video (if available) */}
      {lastMergedUrl && (
        <section className="py-10 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Preview Final Video</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(lastMergedUrl!, '_blank')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Open in New Tab
                </Button>
                <Button variant="outline" onClick={clearPreview}>
                  Clear Preview
                </Button>
              </div>
            </div>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <video src={lastMergedUrl} controls className="w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Inspirations Marquee */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Use Cases</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Perfect For Every Creator</h2>
          </div>
          
          <div className="relative overflow-hidden">
            <Marquee className="[--duration:20s]">
              {inspirationItems.map((item, index) => (
                <Card key={index} className="mx-2 w-64 shrink-0 bg-card border-border hover:bg-accent transition-colors">
                  <CardContent className="p-6 text-center">
                    <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
                    <h3 className="font-semibold text-sm text-foreground">{item.text}</h3>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">How It Works</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Three Simple Steps</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              VoiceGPT uses Google Gemini AI to transform your raw video content into polished explainer videos in minutes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <PremiumFrame>
              <Card className="p-10 border-transparent bg-transparent shadow-none h-full">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-sm font-bold text-primary mb-3">STEP 1</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">AI Video Analysis</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Google Gemini AI analyzes your entire video content, understanding what's happening throughout the video timeline.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Understands complex scenes and UI interactions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Identifies key moments and transitions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Processes entire video in one pass</span>
                  </li>
                </ul>
              </Card>
            </PremiumFrame>

            <PremiumFrame>
              <Card className="p-10 border-transparent bg-transparent shadow-none h-full">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-sm font-bold text-primary mb-3">STEP 2</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Script Generation</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Gemini AI generates natural, engaging scripts in your selected language that explain what's happening in your video.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Conversational and informative tone</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Perfectly timed to match video content</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Available in 10+ languages</span>
                  </li>
                </ul>
              </Card>
            </PremiumFrame>

            <PremiumFrame>
              <Card className="p-10 border-transparent bg-transparent shadow-none h-full">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                  <Mic className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-sm font-bold text-primary mb-3">STEP 3</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Voice-Over Generation</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  ElevenLabs AI creates natural-sounding voice-over audio that matches the tone and pace of your content.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>50+ professional AI voices</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Perfect audio-video synchronization</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Instant preview and download</span>
                  </li>
                </ul>
              </Card>
            </PremiumFrame>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Capabilities</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Powered by Advanced AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create professional explainer videos without manual work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <Languages className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Multi-Language Support</h3>
              <p className="text-muted-foreground">
                Generate scripts and voice-overs in English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, and Arabic.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <Mic className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Natural AI Voices</h3>
              <p className="text-muted-foreground">
                Choose from 50+ professional AI voices with different accents, ages, and tones. Preview before selecting.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <Clock className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process videos in minutes, not hours. Direct video analysis means no frame extraction delays.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <Brain className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Context-Aware AI</h3>
              <p className="text-muted-foreground">
                Gemini AI understands your video's purpose and generates contextually relevant explanations.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <Zap className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Perfect Sync</h3>
              <p className="text-muted-foreground">
                Automatically matches audio duration to video length for seamless playback and professional results.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card hover:bg-accent transition-all hover:shadow-lg">
              <FileVideo className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Instant Download</h3>
              <p className="text-muted-foreground">
                Download your finished video with merged audio in MP4 format, ready to share anywhere.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <ChevronDown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">FAQ</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Common Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about VoiceGPT
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">What video formats are supported?</h3>
              <p className="text-muted-foreground leading-relaxed">
                VoiceGPT supports all common video formats including MP4, MOV, AVI, WebM, and more. The AI can analyze any video content regardless of format.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">How long does it take to process a video?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Most videos are processed in 3-5 minutes. The exact time depends on video length and complexity, but our direct video analysis approach is significantly faster than traditional frame-by-frame methods.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Can I edit the generated script?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! You can review and edit the AI-generated transcript before generating the voice-over. This gives you full control over the final narration.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">What languages are supported?</h3>
              <p className="text-muted-foreground leading-relaxed">
                VoiceGPT supports 10+ languages including English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, and Arabic. Both script generation and voice-over are available in all supported languages.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">How does the voice selection work?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from 50+ professional AI voices. You can preview each voice in your selected language before making a choice, ensuring you find the perfect voice for your content.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Is there a video length limit?</h3>
              <p className="text-muted-foreground leading-relaxed">
                VoiceGPT can handle videos of various lengths. For optimal results and faster processing, we recommend videos under 10 minutes, but longer videos are supported.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <PremiumFrame>
            <Card className="p-16 border-transparent bg-transparent shadow-none">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Ready to Transform<br />Your Videos?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Whether you're creating software tutorials, product demos, educational content, or turning long recordings into digestible explainers, VoiceGPT does the heavy lifting for you.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-center gap-8 flex-wrap text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>No video editing experience needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Results in minutes</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setShowApp(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg font-semibold"
              >
                <Video className="w-5 h-5" />
                Start Creating Now
              </Button>
            </Card>
          </PremiumFrame>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-border">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-foreground">VoiceGPT</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform any video into AI-narrated content with multi-language support and perfect audio-video sync.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 VoiceGPT. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
