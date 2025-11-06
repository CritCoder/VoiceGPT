// Local storage utilities for VoiceGPT state persistence
// Uses localStorage for metadata and IndexedDB for large files

import { saveVideoToDB, getVideoFromDB, deleteVideoFromDB, clearDB } from './db'

const STORAGE_KEYS = {
  CURRENT_STEP: 'voicegpt:currentStep',
  VIDEO_FILE_META: 'voicegpt:videoFileMeta', // Only metadata, actual file in IndexedDB
  VIDEO_DURATION: 'voicegpt:videoDuration',
  ANALYSIS_PROMPT: 'voicegpt:analysisPrompt',
  SELECTED_LANGUAGE: 'voicegpt:selectedLanguage',
  SELECTED_VOICE: 'voicegpt:selectedVoice',
  SELECTED_VOICE_NAME: 'voicegpt:selectedVoiceName',
  TRANSCRIPT: 'voicegpt:transcript',
  AUDIO_URL: 'voicegpt:audioUrl',
  MERGED_VIDEO_URL: 'voicegpt:mergedVideoUrl',
  ORIGINAL_VIDEO_URL: 'voicegpt:originalVideoUrl',
  MERGE_FAILED: 'voicegpt:mergeFailed',
  SHOW_APP: 'voicegpt:showApp',
} as const

export interface VideoFileMeta {
  name: string
  size: number
  type: string
  lastModified: number
}

export interface AppState {
  currentStep: number
  videoFile: File | null
  videoDuration: number
  analysisPrompt: string
  selectedLanguage: string
  selectedVoice: string | null
  selectedVoiceName: string
  transcript: string
  audioUrl: string
  mergedVideoUrl: string
  originalVideoUrl: string
  mergeFailed: boolean
  showApp: boolean
}

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
}

// Extract metadata from File object
const fileToMeta = (file: File): VideoFileMeta => ({
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
})

// Save entire app state
export const saveAppState = async (state: Partial<AppState>): Promise<void> => {
  try {
    if (state.currentStep !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_STEP, state.currentStep.toString())
    }

    // Save video file to IndexedDB and only metadata to localStorage
    if (state.videoFile !== undefined) {
      if (state.videoFile) {
        const meta = fileToMeta(state.videoFile)
        safeLocalStorage.setItem(STORAGE_KEYS.VIDEO_FILE_META, JSON.stringify(meta))
        await saveVideoToDB(state.videoFile)
      } else {
        safeLocalStorage.removeItem(STORAGE_KEYS.VIDEO_FILE_META)
        await deleteVideoFromDB()
      }
    }

    if (state.videoDuration !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.VIDEO_DURATION, state.videoDuration.toString())
    }

    if (state.analysisPrompt !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.ANALYSIS_PROMPT, state.analysisPrompt)
    }

    if (state.selectedLanguage !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, state.selectedLanguage)
    }

    if (state.selectedVoice !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.SELECTED_VOICE, state.selectedVoice || '')
    }

    if (state.selectedVoiceName !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.SELECTED_VOICE_NAME, state.selectedVoiceName)
    }

    if (state.transcript !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.TRANSCRIPT, state.transcript)
    }

    if (state.audioUrl !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.AUDIO_URL, state.audioUrl)
    }

    if (state.mergedVideoUrl !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.MERGED_VIDEO_URL, state.mergedVideoUrl)
    }

    if (state.originalVideoUrl !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.ORIGINAL_VIDEO_URL, state.originalVideoUrl)
    }

    if (state.mergeFailed !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.MERGE_FAILED, state.mergeFailed.toString())
    }

    if (state.showApp !== undefined) {
      safeLocalStorage.setItem(STORAGE_KEYS.SHOW_APP, state.showApp.toString())
    }
  } catch (error) {
    console.error('Error saving app state:', error)
  }
}

// Load entire app state (async because of IndexedDB)
export const loadAppState = async (): Promise<Partial<AppState>> => {
  try {
    const state: Partial<AppState> = {}

    const currentStep = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
    if (currentStep) state.currentStep = parseInt(currentStep, 10)

    // Load video file from IndexedDB
    const videoFileMeta = safeLocalStorage.getItem(STORAGE_KEYS.VIDEO_FILE_META)
    if (videoFileMeta && videoFileMeta !== 'null') {
      try {
        const video = await getVideoFromDB()
        if (video) {
          state.videoFile = video
        }
      } catch (error) {
        console.error('Error loading video from DB:', error)
        state.videoFile = null
      }
    }

    const videoDuration = safeLocalStorage.getItem(STORAGE_KEYS.VIDEO_DURATION)
    if (videoDuration) state.videoDuration = parseFloat(videoDuration)

    const analysisPrompt = safeLocalStorage.getItem(STORAGE_KEYS.ANALYSIS_PROMPT)
    if (analysisPrompt) state.analysisPrompt = analysisPrompt

    const selectedLanguage = safeLocalStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE)
    if (selectedLanguage) state.selectedLanguage = selectedLanguage

    const selectedVoice = safeLocalStorage.getItem(STORAGE_KEYS.SELECTED_VOICE)
    if (selectedVoice) state.selectedVoice = selectedVoice || null

    const selectedVoiceName = safeLocalStorage.getItem(STORAGE_KEYS.SELECTED_VOICE_NAME)
    if (selectedVoiceName) state.selectedVoiceName = selectedVoiceName

    const transcript = safeLocalStorage.getItem(STORAGE_KEYS.TRANSCRIPT)
    if (transcript) state.transcript = transcript

    const audioUrl = safeLocalStorage.getItem(STORAGE_KEYS.AUDIO_URL)
    if (audioUrl) state.audioUrl = audioUrl

    const mergedVideoUrl = safeLocalStorage.getItem(STORAGE_KEYS.MERGED_VIDEO_URL)
    if (mergedVideoUrl) state.mergedVideoUrl = mergedVideoUrl

    const originalVideoUrl = safeLocalStorage.getItem(STORAGE_KEYS.ORIGINAL_VIDEO_URL)
    if (originalVideoUrl) state.originalVideoUrl = originalVideoUrl

    const mergeFailed = safeLocalStorage.getItem(STORAGE_KEYS.MERGE_FAILED)
    if (mergeFailed) state.mergeFailed = mergeFailed === 'true'

    const showApp = safeLocalStorage.getItem(STORAGE_KEYS.SHOW_APP)
    if (showApp) state.showApp = showApp === 'true'

    return state
  } catch (error) {
    console.error('Error loading app state:', error)
    return {}
  }
}

// Clear all app state (for starting over)
export const clearAppState = async (): Promise<void> => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      safeLocalStorage.removeItem(key)
    })
    await clearDB()
  } catch (error) {
    console.error('Error clearing app state:', error)
  }
}

// Check if there's saved progress
export const hasSavedProgress = (): boolean => {
  try {
    const currentStep = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
    const videoFileMeta = safeLocalStorage.getItem(STORAGE_KEYS.VIDEO_FILE_META)
    return !!(currentStep && videoFileMeta && videoFileMeta !== 'null')
  } catch {
    return false
  }
}
