'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Play, Pause, Volume2, Check } from 'lucide-react'

interface Voice {
  voice_id: string
  name: string
  preview_url?: string
  labels?: {
    accent?: string
    description?: string
    age?: string
    gender?: string
    use_case?: string
  }
  high_quality_base_model_ids?: string[]
}

interface VoiceSelectorProps {
  selectedLanguage: string
  selectedVoice: string | null
  onVoiceSelect: (voiceId: string, voiceName: string) => void
}

const LANGUAGE_MODELS: Record<string, { name: string; model: string; sampleText: string }> = {
  'en': {
    name: 'English',
    model: 'eleven_multilingual_v2',
    sampleText: 'Hello! This is how I sound. Listen to my voice and see if you like it.'
  },
  'hi': {
    name: 'Hindi',
    model: 'eleven_multilingual_v2',
    sampleText: 'नमस्ते! यह मेरी आवाज़ है। सुनिए और देखिए कि आपको यह पसंद है या नहीं।'
  },
  'es': {
    name: 'Spanish',
    model: 'eleven_multilingual_v2',
    sampleText: '¡Hola! Así es como sueno. Escucha mi voz y ve si te gusta.'
  },
  'fr': {
    name: 'French',
    model: 'eleven_multilingual_v2',
    sampleText: 'Bonjour! Voici à quoi je ressemble. Écoutez ma voix et voyez si vous l\'aimez.'
  },
  'de': {
    name: 'German',
    model: 'eleven_multilingual_v2',
    sampleText: 'Hallo! So klinge ich. Hören Sie sich meine Stimme an und sehen Sie, ob sie Ihnen gefällt.'
  },
  'pt': {
    name: 'Portuguese',
    model: 'eleven_multilingual_v2',
    sampleText: 'Olá! É assim que eu soo. Ouça minha voz e veja se você gosta.'
  },
  'zh': {
    name: 'Chinese',
    model: 'eleven_multilingual_v2',
    sampleText: '你好！这就是我的声音。听听我的声音，看看你是否喜欢。'
  },
  'ja': {
    name: 'Japanese',
    model: 'eleven_multilingual_v2',
    sampleText: 'こんにちは！私の声はこのように聞こえます。私の声を聞いて、気に入るか確認してください。'
  },
  'ko': {
    name: 'Korean',
    model: 'eleven_multilingual_v2',
    sampleText: '안녕하세요! 이것이 제 목소리입니다. 제 목소리를 듣고 마음에 드는지 확인해보세요.'
  },
  'ar': {
    name: 'Arabic',
    model: 'eleven_multilingual_v2',
    sampleText: 'مرحبا! هذا هو صوتي. استمع إلى صوتي وانظر إذا كان يعجبك.'
  }
}

export function VoiceSelector({ selectedLanguage, selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchVoices()
  }, [])

  const fetchVoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get-voices')
      if (!response.ok) throw new Error('Failed to fetch voices')
      
      const data = await response.json()
      setVoices(data.voices || [])
    } catch (error) {
      console.error('Error fetching voices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async (voiceId: string) => {
    try {
      setPreviewingVoice(voiceId)
      setIsPlaying(true)

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const languageConfig = LANGUAGE_MODELS[selectedLanguage]
      const response = await fetch('/api/preview-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId,
          text: languageConfig.sampleText,
          modelId: languageConfig.model,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate preview')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlaying(false)
        setPreviewingVoice(null)
      }
      
      audio.onerror = () => {
        setIsPlaying(false)
        setPreviewingVoice(null)
      }

      await audio.play()
    } catch (error) {
      console.error('Error previewing voice:', error)
      setIsPlaying(false)
      setPreviewingVoice(null)
    }
  }

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setPreviewingVoice(null)
  }

  // Filter voices based on language - show all for multilingual model
  const filteredVoices = voices.filter(voice => {
    // For multilingual model, show all voices
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#dff000]" />
        <span className="ml-3 text-white">Loading voices...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Label className="text-white/80 text-base">Select Voice</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {filteredVoices.map((voice) => (
          <Card
            key={voice.voice_id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedVoice === voice.voice_id
                ? 'bg-[#dff000]/20 border-[#dff000] border-2'
                : 'bg-white/5 border-white/20 hover:bg-white/10'
            }`}
            onClick={() => onVoiceSelect(voice.voice_id, voice.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-white">{voice.name}</h4>
                    {selectedVoice === voice.voice_id && (
                      <Check className="w-4 h-4 text-[#dff000]" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {voice.labels?.gender && (
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        {voice.labels.gender}
                      </span>
                    )}
                    {voice.labels?.accent && (
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        {voice.labels.accent}
                      </span>
                    )}
                    {voice.labels?.age && (
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                        {voice.labels.age}
                      </span>
                    )}
                  </div>
                  {voice.labels?.description && (
                    <p className="text-xs text-white/60 mb-3">
                      {voice.labels.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  if (previewingVoice === voice.voice_id && isPlaying) {
                    stopPreview()
                  } else {
                    handlePreview(voice.voice_id)
                  }
                }}
                disabled={previewingVoice !== null && previewingVoice !== voice.voice_id}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                {previewingVoice === voice.voice_id && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Preview
                  </>
                ) : previewingVoice === voice.voice_id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Preview Voice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredVoices.length === 0 && (
        <div className="text-center p-8 text-white/60">
          <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No voices available for this language</p>
        </div>
      )}
    </div>
  )
}

