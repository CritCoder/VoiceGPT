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
  { icon: Layers, text: "Frame Extraction", color: "text-orange-500" },
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
    <div className="min-h-screen bg-black font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M8 4v16l8-8-8-8z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">FrameCraft</span>
            </div>
            <Button 
              onClick={() => setShowApp(true)}
              className="bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white font-serif">
            Turn Any Video Into an AI-Narrated Explainer
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Upload your video and watch as Google Gemini AI analyzes the entire video content, generates a natural script based on what it sees, and creates professional voice-over narration. Perfect for creating tutorials, product demos, educational content, or transforming screen recordings into polished explainer videos.
          </p>

          <Button 
            size="lg" 
            onClick={() => setShowApp(true)} 
            className="gap-2 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
          >
            <Upload className="w-5 h-5" />
            Try It Free - Upload Your First Video
          </Button>
        </div>
      </section>

      {/* Preview Final Video (if available) */}
      {lastMergedUrl && (
        <section className="py-10 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Preview Final Video</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(lastMergedUrl!, '_blank')}
                  className="bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                >
                  Open in New Tab
                </Button>
                <Button variant="outline" onClick={clearPreview} className="border-white/20 text-black hover:bg-white/10">
                  Clear Preview
                </Button>
              </div>
            </div>
            <PremiumFrame>
              <Card className="bg-transparent border-transparent shadow-none">
                <CardContent className="p-4">
                  <video src={lastMergedUrl} controls className="w-full rounded-md" />
                </CardContent>
              </Card>
            </PremiumFrame>
          </div>
        </section>
      )}

      {/* Inspirations Marquee */}
      <section className="py-12 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center gap-2 font-serif text-white">
            <Sparkles className="w-6 h-6 text-[#dff000]" />
            Perfect For
          </h2>
          
          <div className="relative overflow-hidden">
            <Marquee className="[--duration:20s]">
              {inspirationItems.map((item, index) => (
                <Card key={index} className="mx-2 w-64 shrink-0 bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-6 text-center">
                    <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
                    <h3 className="font-semibold text-sm text-white">{item.text}</h3>
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
          <h2 className="text-3xl font-bold text-center mb-4 font-serif">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            FrameCraft uses Google Gemini AI to transform your raw video content into polished explainer videos. Here's what happens when you upload a video:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Upload className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-3">1. AI Video Analysis</h3>
              <p className="text-muted-foreground mb-3">
                Google Gemini AI analyzes your entire video content, understanding what's happening throughout the video timeline. It processes the visual and contextual information to create comprehensive understanding.
              </p>
              <p className="text-sm text-muted-foreground">
                This advanced AI can understand complex scenes, UI interactions, product demonstrations, and educational content to create accurate narrations.
              </p>
            </Card>
            <Card className="p-6">
              <Brain className="w-12 h-12 mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-3">2. Intelligent Script Generation</h3>
              <p className="text-muted-foreground mb-3">
                Based on the video analysis, Gemini AI generates a natural, engaging script that explains what's happening in your video. It understands context, flow, and creates professional narration.
              </p>
              <p className="text-sm text-muted-foreground">
                The AI creates scripts that are conversational, informative, and perfectly timed to match your video content and your specified goals.
              </p>
            </Card>
            <Card className="p-6">
              <Wand2 className="w-12 h-12 mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-3">3. Professional Voice-Over</h3>
              <p className="text-muted-foreground mb-3">
                Using the generated script, ElevenLabs AI creates natural-sounding voice-over audio that matches the tone and pace of your content. Then, the audio is seamlessly merged with your original video.
              </p>
              <p className="text-sm text-muted-foreground">
                The result is a professional explainer video that sounds like it was created by a human narrator, perfectly synchronized with your video content.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Videos?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Whether you're creating software tutorials, product demos, educational content, or turning long recordings into digestible explainers, FrameCraft does the heavy lifting for you.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            No video editing experience required. No manual scripting. Just upload your video and let AI handle the rest. Start creating professional explainer videos in minutes, not hours.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowApp(true)} 
            className="gap-2 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
          >
            <Video className="w-5 h-5" />
            Get Started - Upload Your Video
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M8 4v16l8-8-8-8z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">FrameCraft</span>
              </div>
              <p className="text-sm text-white/70">
                Transform any video into an AI-narrated explainer with advanced frame extraction and natural language generation.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Support</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-white/70">
              © 2024 FrameCraft. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
