'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PremiumFrame } from '@/components/ui/premium-frame'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceSelector } from '@/components/voice-selector'
import { Loader2, Upload, ChevronRight, ChevronLeft, Play, Volume2, Download, FileText, Globe, Home, FileVideo } from 'lucide-react'
import { saveAppState, loadAppState, clearAppState } from '@/lib/storage'

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
  const [mergeFailed, setMergeFailed] = useState(false)
  const [originalVideoUrl, setOriginalVideoUrl] = useState('')

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Track if we've loaded state from storage
  const [hasLoadedState, setHasLoadedState] = useState(false)

  // Logging function
  const addLog = (message: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  // Load state from IndexedDB and localStorage on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        addLog('Loading saved state from storage...')
        const savedState = await loadAppState()

        if (savedState.currentStep) {
          setCurrentStep(savedState.currentStep)
          addLog(`Restored step: ${savedState.currentStep}`)
        }

        if (savedState.videoFile) {
          setVideoFile(savedState.videoFile)
          const videoUrl = URL.createObjectURL(savedState.videoFile)
          setOriginalVideoUrl(videoUrl)
          addLog(`Restored video file: ${savedState.videoFile.name}`)
        }

        if (savedState.videoDuration) {
          setVideoDuration(savedState.videoDuration)
        }

        if (savedState.analysisPrompt) {
          setAnalysisPrompt(savedState.analysisPrompt)
        }

        if (savedState.selectedLanguage) {
          setSelectedLanguage(savedState.selectedLanguage)
        }

        if (savedState.selectedVoice) {
          setSelectedVoice(savedState.selectedVoice)
        }

        if (savedState.selectedVoiceName) {
          setSelectedVoiceName(savedState.selectedVoiceName)
        }

        if (savedState.transcript) {
          setTranscript(savedState.transcript)
        }

        if (savedState.audioUrl) {
          setAudioUrl(savedState.audioUrl)
        }

        if (savedState.mergedVideoUrl) {
          setMergedVideoUrl(savedState.mergedVideoUrl)
        }

        if (savedState.mergeFailed !== undefined) {
          setMergeFailed(savedState.mergeFailed)
        }

        setHasLoadedState(true)
        addLog('State restoration complete')
      } catch (error) {
        console.error('Error loading saved state:', error)
        setHasLoadedState(true)
      }
    }

    loadSavedState()
  }, [])

  // Save state to storage whenever it changes
  useEffect(() => {
    if (!hasLoadedState) return // Don't save during initial load

    const saveState = async () => {
      try {
        await saveAppState({
          currentStep,
          videoFile,
          videoDuration,
          analysisPrompt,
          selectedLanguage,
          selectedVoice,
          selectedVoiceName,
          transcript,
          audioUrl,
          mergedVideoUrl,
          originalVideoUrl,
          mergeFailed,
          showApp: true,
        })
      } catch (error) {
        console.error('Error saving state:', error)
      }
    }

    saveState()
  }, [
    hasLoadedState,
    currentStep,
    videoFile,
    videoDuration,
    analysisPrompt,
    selectedLanguage,
    selectedVoice,
    selectedVoiceName,
    transcript,
    audioUrl,
    mergedVideoUrl,
    originalVideoUrl,
    mergeFailed,
  ])

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file')
      return
    }

    setVideoFile(file)
    addLog(`Video file selected: ${file.name}`)

    // Store original video URL for fallback
    const videoUrl = URL.createObjectURL(file)
    setOriginalVideoUrl(videoUrl)

    // Get video duration
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration)
      addLog(`Video duration: ${video.duration.toFixed(2)} seconds`)
    }
    video.src = videoUrl
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))

    if (videoFile) {
      handleFileUpload(videoFile)
    } else {
      alert('Please drop a valid video file')
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()

    const items = Array.from(e.clipboardData.items)
    const videoItem = items.find(item => item.type.startsWith('video/'))

    if (videoItem) {
      const file = videoItem.getAsFile()
      if (file) {
        handleFileUpload(file)
        addLog('Video pasted from clipboard')
      }
    } else {
      // Check for files in clipboard
      const files = Array.from(e.clipboardData.files)
      const videoFile = files.find(file => file.type.startsWith('video/'))

      if (videoFile) {
        handleFileUpload(videoFile)
        addLog('Video pasted from clipboard')
      } else {
        alert('No video found in clipboard. Please copy a video file first.')
      }
    }
  }

  // Add global paste listener for the upload area
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (currentStep !== 1 || videoFile) return // Only handle paste on step 1 without video

      const items = Array.from(e.clipboardData?.items || [])
      const files = Array.from(e.clipboardData?.files || [])

      const videoItem = items.find(item => item.type.startsWith('video/'))
      const videoFileFromClipboard = files.find(file => file.type.startsWith('video/'))

      if (videoItem) {
        const file = videoItem.getAsFile()
        if (file) {
          e.preventDefault()
          handleFileUpload(file)
          addLog('Video pasted from clipboard (global)')
        }
      } else if (videoFileFromClipboard) {
        e.preventDefault()
        handleFileUpload(videoFileFromClipboard)
        addLog('Video pasted from clipboard (global)')
      }
    }

    document.addEventListener('paste', handleGlobalPaste)
    return () => document.removeEventListener('paste', handleGlobalPaste)
  }, [currentStep, videoFile])

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

      setProcessingProgress(30)
      setProcessingStep('Sending transcript to ElevenLabs...')

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

      setProcessingProgress(70)
      setProcessingStep('Processing audio response...')

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
    setMergeFailed(false)
    setProcessingStep('Preparing to merge audio and video...')
    setProcessingProgress(0)

    try {
      addLog('Starting video generation...')

      setProcessingProgress(20)
      setProcessingStep('Uploading files to server...')

      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('audio', audioBlobState, 'audio.mp3')
      formData.append('videoDuration', videoDuration.toString())
      formData.append('audioDuration', audioRef.current?.duration.toString() || '0')

      setProcessingProgress(40)
      setProcessingStep('Merging audio with video...')

      const response = await fetch('/api/merge-av', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      setProcessingProgress(80)
      setProcessingStep('Processing merged video...')

      const videoBlob = await response.blob()
      const videoUrl = URL.createObjectURL(videoBlob)

      setMergedVideoUrl(videoUrl)
      setProcessingProgress(100)
      setProcessingStep('Video generated!')

      addLog('Video generation completed')
      addLog(`Merged video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`)

      // Move to final step
      setTimeout(() => {
        setCurrentStep(5)
        setIsMerging(false)
        setProcessingStep('')
        setProcessingProgress(0)
        setMergeFailed(false)
      }, 1000)

    } catch (error) {
      addLog(`Error generating video: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setProcessingStep(`Video merging failed, showing fallback option`)
      setMergeFailed(true)
      setIsMerging(false)
      
      // Still move to step 5 to show fallback (video + audio)
      setTimeout(() => {
        setCurrentStep(5)
        setProcessingStep('')
        setProcessingProgress(0)
      }, 1000)
    }
  }

  // Navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const goToHome = async () => {
    if (confirm('Are you sure you want to go back to home? Your current progress will be saved.')) {
      // Save current state
      await saveAppState({
        currentStep,
        videoFile,
        videoDuration,
        analysisPrompt,
        selectedLanguage,
        selectedVoice,
        selectedVoiceName,
        transcript,
        audioUrl,
        mergedVideoUrl,
        originalVideoUrl,
        mergeFailed,
        showApp: false, // Set to false so landing page shows
      })
      // Reload to go back to landing page
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col overflow-x-hidden">
      {/* Header with Home Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/50 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={goToHome}>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-border hover:bg-primary/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground hover:text-primary transition-colors">VoiceGPT</span>
              <span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
            </div>
            <Button
              onClick={goToHome}
              variant="outline"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-8 container mx-auto px-6 pt-24">
        {/* Step 1: Video Upload & Purpose */}
        {currentStep === 1 && (
          <PremiumFrame className="max-w-4xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Upload className="w-5 h-5" />
                  <span>Step 1: Upload Video & Configure</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upload your video, select language & voice, and set your purpose
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger
                      value="video"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                    >
                      1. Video {videoFile && analysisPrompt && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                    <TabsTrigger
                      value="language"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                      disabled={!videoFile || !analysisPrompt}
                    >
                      2. Language {selectedLanguage && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                    <TabsTrigger
                      value="voice"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                      disabled={!selectedLanguage}
                    >
                      3. Voice {selectedVoice && <span className="ml-1">✓</span>}
                    </TabsTrigger>
                  </TabsList>

                  {/* Video Upload Tab */}
                  <TabsContent value="video" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label className="text-foreground text-base">Upload Video</Label>
                      <div
                        className="relative border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onPaste={handlePaste}
                        onClick={() => fileInputRef.current?.click()}
                        tabIndex={0}
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
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                              <FileVideo className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-foreground font-semibold text-lg">{videoFile.name}</p>
                              <p className="text-muted-foreground text-sm mt-1">
                                {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                {videoDuration > 0 && ` • ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}`}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setVideoFile(null)
                                setAnalysisPrompt('')
                              }}
                              className="mt-2"
                            >
                              Change Video
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="relative">
                              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Upload className="w-8 h-8 text-primary" />
                              </div>
                            </div>
                            <div>
                              <p className="text-foreground font-semibold text-lg">Upload Your Video</p>
                              <p className="text-muted-foreground text-sm mt-2">
                                Click to browse, drag & drop, or paste (Ctrl+V / Cmd+V)
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                              <span className="flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                Click
                              </span>
                              <span className="flex items-center gap-1">
                                <FileVideo className="w-3 h-3" />
                                Drag & Drop
                              </span>
                              <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border border-border rounded">Ctrl+V</kbd>
                                Paste
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              Supported formats: MP4, MOV, AVI, WebM, and more
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground text-base">What do you want to explain?</Label>
                      <Textarea
                        value={analysisPrompt}
                        onChange={(e) => setAnalysisPrompt(e.target.value)}
                        placeholder="e.g., This is a platform for social media management. Users can schedule posts, analyze engagement metrics, and collaborate with team members..."
                        rows={4}
                        className="bg-card resize-none"
                      />
                    </div>

                    {videoFile && analysisPrompt.trim() && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => setActiveTab('language')}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                      <Label className="text-foreground text-base flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Select Output Language
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {LANGUAGES.map((lang) => (
                          <Card
                            key={lang.code}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                              selectedLanguage === lang.code
                                ? 'bg-primary/20 border-primary border-2'
                                : 'bg-card hover:bg-muted'
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
                              <div className="font-semibold text-foreground text-sm">{lang.name}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('video')}
                          className="flex-1"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        {selectedLanguage && (
                          <Button
                            onClick={() => setActiveTab('voice')}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                        className="flex-1"
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
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  Continue to Analysis
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>

                {(!videoFile || !analysisPrompt.trim() || !selectedVoice) && (
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="text-foreground text-sm text-center font-medium">
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
          <PremiumFrame className="max-w-3xl mx-auto">
            <Card className="bg-transparent border-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <FileText className="w-5 h-5" />
                  <span>Step 2: AI Video Analysis</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  AI will analyze your video and create a detailed transcript with timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {videoFile && (
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <h3 className="text-foreground font-medium mb-3">Configuration Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Video File</p>
                          <p className="text-foreground text-sm font-medium">{videoFile.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                            {videoDuration > 0 && ` • ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Purpose</p>
                          <p className="text-foreground text-sm font-medium">{analysisPrompt}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Language</p>
                          <p className="text-foreground text-sm font-medium">
                            {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Voice</p>
                          <p className="text-foreground text-sm font-medium">{selectedVoiceName}</p>
                        </div>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-4">
                        <div className="bg-card rounded-lg p-4 border border-border">
                          <div className="flex items-center space-x-2 mb-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-foreground font-medium">{processingStep}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${processingProgress}%` }}
                            />
                          </div>
                          <p className="text-muted-foreground text-sm mt-2">{processingProgress}% complete</p>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleAnalyzeVideo}
                        disabled={isProcessing}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <FileText className="w-5 h-5" />
                  <span>Step 3: Review Generated Transcript</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Review the AI-generated transcript with timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-foreground font-medium mb-3">Generated Transcript</h3>
                    <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-foreground text-sm whitespace-pre-wrap font-mono">
                        {transcript}
                      </pre>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-foreground font-medium">{processingStep}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${processingProgress}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">{processingProgress}% complete</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleGenerateAudio}
                      disabled={isProcessing}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Volume2 className="w-5 h-5" />
                  <span>Step 4: Generated Audio</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Review the generated audio narration in {selectedVoiceName}'s voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {audioUrl && (
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-foreground font-medium">Generated Audio</h3>
                        <div className="text-xs text-muted-foreground">
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

                    {isMerging && (
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-foreground font-medium">{processingStep}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${processingProgress}%` }}
                          />
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">{processingProgress}% complete</p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleGenerateVideo}
                        disabled={isMerging}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
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
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Play className="w-5 h-5" />
                  <span>Step 5: Final Video</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your AI-narrated video is ready!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mergedVideoUrl && !mergeFailed ? (
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <h3 className="text-foreground font-medium mb-3">Final Video</h3>
                      <video
                        src={mergedVideoUrl}
                        controls
                        className="w-full rounded-lg"
                        poster=""
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1">
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
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                ) : mergeFailed && videoFile && audioBlobState ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-2">
                        ⚠️ Video merging failed, but you can still use your video with audio!
                      </p>
                      <p className="text-muted-foreground text-xs">
                        The video and audio are ready separately. Play them together or download both files.
                      </p>
                    </div>

                    <div className="bg-card rounded-lg p-4 border border-border">
                      <h3 className="text-foreground font-medium mb-3">Video with Audio</h3>
                      <div className="space-y-4">
                        <video
                          src={originalVideoUrl}
                          controls
                          className="w-full rounded-lg"
                          id="video-player"
                        />
                        <div className="bg-muted rounded-lg p-3">
                          <p className="text-sm text-muted-foreground mb-2">Audio Narration:</p>
                          <audio
                            src={audioUrl}
                            controls
                            className="w-full"
                            id="audio-player"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 Tip: Start both players at the same time for synchronized playback
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (videoFile) {
                            const a = document.createElement('a')
                            a.href = originalVideoUrl
                            a.download = videoFile.name || 'original-video.mp4'
                            a.click()
                          }
                        }}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (audioBlobState) {
                            const a = document.createElement('a')
                            const url = URL.createObjectURL(audioBlobState)
                            a.href = url
                            a.download = 'narration-audio.mp3'
                            a.click()
                            URL.revokeObjectURL(url)
                          }
                        }}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Audio
                      </Button>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          // Try to sync both players
                          const videoPlayer = document.getElementById('video-player') as HTMLVideoElement
                          const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement
                          if (videoPlayer && audioPlayer) {
                            videoPlayer.play()
                            audioPlayer.play()
                          }
                        }}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Both Together
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </PremiumFrame>
        )}
      </div>
    </div>
  )
}
