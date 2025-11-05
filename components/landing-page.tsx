"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PremiumFrame } from '@/components/ui/premium-frame'
import { VideoAnalyzer } from '@/components/video-analyzer'
import Marquee from '@/components/ui/marquee'
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
  Layers
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

  useEffect(() => {
    try {
      const url = localStorage.getItem('framecraft:lastMergedVideoUrl')
      if (url) setLastMergedUrl(url)
    } catch {}
  }, [])

  const clearPreview = () => {
    try {
      localStorage.removeItem('framecraft:lastMergedVideoUrl')
    } catch {}
    setLastMergedUrl(null)
  }

  if (showApp) {
    return <VideoAnalyzer />
  }

  return (
    <div className="min-h-screen bg-background font-sans">
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
            <Button 
              onClick={() => setShowApp(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-border mb-6">
            <span className="text-sm text-muted-foreground">✨ AI-Powered • 10+ Languages • Perfect Sync</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight">
            Turn Any Video Into an
            <span className="text-primary"> AI-Narrated</span> Explainer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload your video and watch as AI analyzes content, generates natural scripts in any language, and creates professional voice-overs with perfect synchronization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => setShowApp(true)} 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8"
            >
              <Upload className="w-5 h-5" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 h-12 px-8"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
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
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center gap-2 text-foreground">
            <Sparkles className="w-6 h-6 text-primary" />
            Perfect For
          </h2>
          
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
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            VoiceGPT uses Google Gemini AI to transform your raw video content into polished explainer videos. Here's what happens when you upload a video:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card hover:bg-accent transition-colors">
              <Upload className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">1. AI Video Analysis</h3>
              <p className="text-muted-foreground mb-3">
                Google Gemini AI analyzes your entire video content, understanding what's happening throughout the video timeline.
              </p>
              <p className="text-sm text-muted-foreground">
                This advanced AI can understand complex scenes, UI interactions, product demonstrations, and educational content.
              </p>
            </Card>
            <Card className="p-6 border-border bg-card hover:bg-accent transition-colors">
              <Brain className="w-12 h-12 mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">2. Intelligent Script Generation</h3>
              <p className="text-muted-foreground mb-3">
                Gemini AI generates natural, engaging scripts in your selected language that explain what's happening in your video.
              </p>
              <p className="text-sm text-muted-foreground">
                The AI creates scripts that are conversational, informative, and perfectly timed to match your video content.
              </p>
            </Card>
            <Card className="p-6 border-border bg-card hover:bg-accent transition-colors">
              <Wand2 className="w-12 h-12 mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">3. Professional Voice-Over</h3>
              <p className="text-muted-foreground mb-3">
                ElevenLabs AI creates natural-sounding voice-over audio that matches the tone and pace of your content.
              </p>
              <p className="text-sm text-muted-foreground">
                The result is a professional explainer video with perfect audio-video synchronization.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/50 border-y border-border">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Transform Your Videos?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Whether you're creating software tutorials, product demos, educational content, or turning long recordings into digestible explainers, VoiceGPT does the heavy lifting for you.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            No video editing experience required. No manual scripting. Just upload your video and let AI handle the rest. Start creating professional explainer videos in minutes, not hours.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowApp(true)} 
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8"
          >
            <Video className="w-5 h-5" />
            Get Started - Upload Your Video
          </Button>
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
