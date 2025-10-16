'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PremiumFrame } from '@/components/ui/premium-frame'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceSelector } from '@/components/voice-selector'
import { Loader2, Upload, ChevronRight, ChevronLeft, Play, Volume2, Download, FileText, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
]

export function VideoAnalyzer() {
  // Main state
  const [currentStep, setCurrentStep] = useState(1)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [analysisPrompt, setAnalysisPrompt] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('')
  const [activeTab, setActiveTab] = useState('video')
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState('')
  
  // Results
  const [transcript, setTranscript] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioBlobState, setAudioBlobState] = useState<Blob | null>(null)
  const [mergedVideoUrl, setMergedVideoUrl] = useState('')
  const [isMerging, setIsMerging] = useState(false)
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Logging function
  const addLog = (message: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setVideoFile(file)
    setAnalysisPrompt('') // Reset prompt when new video is uploaded
    addLog(`Video file selected: ${file.name}`)
    
    // Get video duration
    const videoUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration)
      addLog(`Video duration: ${video.duration.toFixed(2)} seconds`)
      URL.revokeObjectURL(videoUrl)
    }
    video.src = videoUrl
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))
    if (videoFile) {
      handleFileUpload(videoFile)
    }
  }

  // Analyze video with Gemini
  const handleAnalyzeVideo = async () => {
    if (!videoFile || !analysisPrompt.trim()) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStep('Analyzing video with AI...')
    setTranscript('')

    try {
      addLog(`Starting video analysis for: ${videoFile.name}`)
      addLog(`Video size: ${(videoFile.size / 1024 / 1024).toFixed(2)} MB`)
      addLog(`Analysis prompt: ${analysisPrompt}`)
      addLog(`Selected language: ${LANGUAGES.find(l => l.code === selectedLanguage)?.name}`)
      
      setProcessingProgress(20)
      setProcessingStep('Uploading video to AI...')

      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('prompt', analysisPrompt)
      formData.append('language', selectedLanguage)
      formData.append('languageName', LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English')
      formData.append('videoDuration', videoDuration.toString())

      setProcessingProgress(40)
      setProcessingStep('AI is analyzing your video...')

      const response = await fetch('/api/analyze-video-gemini', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      setProcessingProgress(80)
      setProcessingStep('Processing results...')

      const result = await response.json()
      setTranscript(result.transcript)
      
      // Store timestamps for potential future use
      if (result.timestamps) {
        console.log('📊 [Video Analysis] Received timestamps:', result.timestamps.length)
      }
      
      setProcessingProgress(100)
      setProcessingStep('Analysis complete!')
      
      addLog(`Video analysis completed successfully`)
      addLog(`Transcript length: ${result.transcript.length} characters`)
      
      // Move to next step after a brief delay
      setTimeout(() => {
        setCurrentStep(3)
        setIsProcessing(false)
        setProcessingStep('')
        setProcessingProgress(0)
      }, 1000)

    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setProcessingStep('Analysis failed')
      setIsProcessing(false)
    }
  }

  // Generate audio from transcript
  const handleGenerateAudio = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    setProcessingStep('Generating audio...')
    setProcessingProgress(0)

    try {
      addLog('Starting audio generation...')
      addLog(`Using voice: ${selectedVoiceName} (${selectedVoice})`)
      addLog(`Language: ${selectedLanguage}`)
      
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          voiceId: selectedVoice,
          language: selectedLanguage,
          videoDuration: videoDuration,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      setAudioUrl(audioUrl)
      setAudioBlobState(audioBlob)
      setProcessingProgress(100)
      setProcessingStep('Audio generated!')
      
      addLog('Audio generation completed')
      
      // Move to next step
      setTimeout(() => {
        setCurrentStep(4)
        setIsProcessing(false)
        setProcessingStep('')
        setProcessingProgress(0)
      }, 1000)

    } catch (error) {
      addLog(`Error generating audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setProcessingStep('Audio generation failed')
      setIsProcessing(false)
    }
  }

  // Generate final video
  const handleGenerateVideo = async () => {
    if (!videoFile || !audioBlobState) return

    setIsMerging(true)
    setProcessingStep('Merging audio and video...')
    setProcessingProgress(0)

    try {
      addLog('Starting video generation...')
      
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('audio', audioBlobState, 'audio.mp3')
      formData.append('videoDuration', videoDuration.toString())
      formData.append('audioDuration', audioRef.current?.duration.toString() || '0')

      const response = await fetch('/api/merge-av', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const videoBlob = await response.blob()
      const videoUrl = URL.createObjectURL(videoBlob)
      
      setMergedVideoUrl(videoUrl)
      setProcessingProgress(100)
      setProcessingStep('Video generated!')
      
      addLog('Video generation completed')
      
      // Move to final step
      setTimeout(() => {
        setCurrentStep(5)
        setIsMerging(false)
        setProcessingStep('')
        setProcessingProgress(0)
      }, 1000)

    } catch (error) {
      addLog(`Error generating video: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setProcessingStep('Video generation failed')
      setIsMerging(false)
    }
  }

  // Navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-black font-sans">
      <div className="container mx-auto px-6 py-8">
        {/* Step 1: Video Upload & Purpose */}
        {currentStep === 1 && (
          <PremiumFrame className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Upload className="w-5 h-5" />
                  <span>Step 1: Upload Video & Configure</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Upload your video, select language & voice, and set your purpose
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/5">
                    <TabsTrigger 
                      value="video" 
                      className="data-[state=active]:bg-[#dff000] data-[state=active]:text-black relative"
                    >
                      1. Video {videoFile && analysisPrompt && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="language" 
                      className="data-[state=active]:bg-[#dff000] data-[state=active]:text-black relative" 
                      disabled={!videoFile || !analysisPrompt}
                    >
                      2. Language {selectedLanguage && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="voice" 
                      className="data-[state=active]:bg-[#dff000] data-[state=active]:text-black relative" 
                      disabled={!selectedLanguage}
                    >
                      3. Voice {selectedVoice && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                  </TabsList>

                  {/* Video Upload Tab */}
                  <TabsContent value="video" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label className="text-white/80 text-base">Upload Video</Label>
                      <div
                        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                          className="hidden"
                        />
                        {videoFile ? (
                          <div className="space-y-2">
                            <FileText className="w-12 h-12 mx-auto text-white/60" />
                            <p className="text-white font-medium">{videoFile.name}</p>
                            <p className="text-white/60 text-sm">
                              {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setVideoFile(null)
                              }}
                              className="mt-2 border-white/20 text-white hover:bg-white/10"
                            >
                              Change Video
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-white/60" />
                            <p className="text-white/80">Click to upload or drag and drop</p>
                            <p className="text-white/60 text-sm">MP4, MOV, AVI, etc.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80 text-base">What do you want to explain?</Label>
                      <Input
                        value={analysisPrompt}
                        onChange={(e) => setAnalysisPrompt(e.target.value)}
                        placeholder="e.g., This is a platform for social media management..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    {videoFile && analysisPrompt.trim() && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => setActiveTab('language')}
                          className="bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                        >
                          Next: Select Language
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Language Selection Tab */}
                  <TabsContent value="language" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label className="text-white/80 text-base flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Select Output Language
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {LANGUAGES.map((lang) => (
                          <Card
                            key={lang.code}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                              selectedLanguage === lang.code
                                ? 'bg-[#dff000]/20 border-[#dff000] border-2'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setSelectedLanguage(lang.code)
                              setSelectedVoice(null)
                              setSelectedVoiceName('')
                              // Auto-advance to voice selection
                              setTimeout(() => setActiveTab('voice'), 300)
                            }}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-3xl mb-2">{lang.flag}</div>
                              <div className="font-semibold text-white text-sm">{lang.name}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('video')}
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        {selectedLanguage && (
                          <Button
                            onClick={() => setActiveTab('voice')}
                            className="flex-1 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                          >
                            Next: Select Voice
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Voice Selection Tab */}
                  <TabsContent value="voice" className="space-y-4 mt-6">
                    <VoiceSelector
                      selectedLanguage={selectedLanguage}
                      selectedVoice={selectedVoice}
                      onVoiceSelect={(voiceId, voiceName) => {
                        setSelectedVoice(voiceId)
                        setSelectedVoiceName(voiceName)
                      }}
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('language')}
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Language
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={nextStep} 
                  disabled={!videoFile || !analysisPrompt.trim() || !selectedVoice}
                  className="w-full bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                >
                  Continue to Analysis
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>

                {(!videoFile || !analysisPrompt.trim() || !selectedVoice) && (
                  <div className="bg-[#dff000]/10 border border-[#dff000]/30 rounded-lg p-4">
                    <p className="text-white/80 text-sm text-center font-medium">
                      {!videoFile || !analysisPrompt.trim() ? 
                        '👆 Please complete the "Video" tab first' : 
                       activeTab === 'video' && videoFile && analysisPrompt ?
                        '✅ Great! Now click "Next: Select Language" button above' :
                       !selectedLanguage ? 
                        '👆 Click the "2. Language" tab to select your language' :
                       !selectedVoice ? 
                        '👆 Click the "3. Voice" tab to select and preview voices' : ''}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </PremiumFrame>
        )}

        {/* Step 2: AI Analysis */}
        {currentStep === 2 && (
          <PremiumFrame className="max-w-2xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="w-5 h-5" />
                  <span>Step 2: AI Video Analysis</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  AI will analyze your video and create a detailed transcript with timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {videoFile && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-3">Configuration Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/60 text-xs mb-1">Video File</p>
                          <p className="text-white/80 text-sm font-medium">{videoFile.name}</p>
                          <p className="text-white/60 text-xs">
                            {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                            {videoDuration > 0 && ` • ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Purpose</p>
                          <p className="text-white/80 text-sm font-medium">{analysisPrompt}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Language</p>
                          <p className="text-white/80 text-sm font-medium">
                            {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Voice</p>
                          <p className="text-white/80 text-sm font-medium">{selectedVoiceName}</p>
                        </div>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#dff000]" />
                            <span className="text-white font-medium">{processingStep}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-[#dff000] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${processingProgress}%` }}
                            />
                          </div>
                          <p className="text-white/60 text-sm mt-2">{processingProgress}% complete</p>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button 
                        onClick={handleAnalyzeVideo} 
                        disabled={isProcessing}
                        className="flex-1 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Analyze Video
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </PremiumFrame>
        )}

        {/* Step 3: Review Transcript */}
        {currentStep === 3 && (
          <PremiumFrame className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="w-5 h-5" />
                  <span>Step 3: Review Generated Transcript</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Review the AI-generated transcript with timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Generated Transcript</h3>
                    <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                        {transcript}
                      </pre>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      onClick={handleGenerateAudio} 
                      disabled={isProcessing}
                      className="flex-1 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Audio...
                        </>
                      ) : (
                        <>
                          Generate Audio
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumFrame>
        )}

        {/* Step 4: Audio Generation */}
        {currentStep === 4 && (
          <PremiumFrame className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Volume2 className="w-5 h-5" />
                  <span>Step 4: Generated Audio</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Review the generated audio narration in {selectedVoiceName}'s voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {audioUrl && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">Generated Audio</h3>
                        <div className="text-xs text-white/60">
                          {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {selectedVoiceName}
                        </div>
                      </div>
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        controls
                        className="w-full"
                        onLoadedMetadata={() => {
                          if (audioRef.current) {
                            setDuration(audioRef.current.duration)
                          }
                        }}
                        onTimeUpdate={() => {
                          if (audioRef.current) {
                            setCurrentTime(audioRef.current.currentTime)
                          }
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button 
                        onClick={handleGenerateVideo} 
                        disabled={isMerging}
                        className="flex-1 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                      >
                        {isMerging ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Video...
                          </>
                        ) : (
                          <>
                            Generate Final Video
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </PremiumFrame>
        )}

        {/* Step 5: Final Result */}
        {currentStep === 5 && (
          <PremiumFrame className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Play className="w-5 h-5" />
                  <span>Step 5: Final Video</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Your AI-narrated video is ready!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mergedVideoUrl && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-3">Final Video</h3>
                      <video
                        src={mergedVideoUrl}
                        controls
                        className="w-full rounded-lg"
                        poster=""
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button 
                        onClick={() => {
                          const a = document.createElement('a')
                          a.href = mergedVideoUrl
                          a.download = 'ai-narrated-video.mp4'
                          a.click()
                        }}
                        className="flex-1 bg-[#dff000] text-black hover:bg-[#dff000]/90 font-semibold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </PremiumFrame>
        )}
      </div>
    </div>
  )
}
