// IndexedDB utilities for storing large files (videos, audio)

const DB_NAME = 'voicegpt-db'
const DB_VERSION = 1
const VIDEO_STORE = 'videos'
const AUDIO_STORE = 'audio'

let dbInstance: IDBDatabase | null = null

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE)
      }
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE)
      }
    }
  })
}

// Save video file to IndexedDB
export const saveVideoToDB = async (file: File): Promise<string> => {
  const db = await initDB()
  const key = 'current-video'

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VIDEO_STORE], 'readwrite')
    const store = transaction.objectStore(VIDEO_STORE)
    const request = store.put(file, key)

    request.onsuccess = () => resolve(key)
    request.onerror = () => reject(request.error)
  })
}

// Get video file from IndexedDB
export const getVideoFromDB = async (): Promise<File | null> => {
  try {
    const db = await initDB()
    const key = 'current-video'

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEO_STORE], 'readonly')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting video from DB:', error)
    return null
  }
}

// Delete video file from IndexedDB
export const deleteVideoFromDB = async (): Promise<void> => {
  try {
    const db = await initDB()
    const key = 'current-video'

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([VIDEO_STORE], 'readwrite')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error deleting video from DB:', error)
  }
}

// Save audio blob to IndexedDB
export const saveAudioToDB = async (blob: Blob, key: string = 'current-audio'): Promise<string> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([AUDIO_STORE], 'readwrite')
    const store = transaction.objectStore(AUDIO_STORE)
    const request = store.put(blob, key)

    request.onsuccess = () => resolve(key)
    request.onerror = () => reject(request.error)
  })
}

// Get audio blob from IndexedDB
export const getAudioFromDB = async (key: string = 'current-audio'): Promise<Blob | null> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], 'readonly')
      const store = transaction.objectStore(AUDIO_STORE)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting audio from DB:', error)
    return null
  }
}

// Delete audio blob from IndexedDB
export const deleteAudioFromDB = async (key: string = 'current-audio'): Promise<void> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], 'readwrite')
      const store = transaction.objectStore(AUDIO_STORE)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error deleting audio from DB:', error)
  }
}

// Clear all data from IndexedDB
export const clearDB = async (): Promise<void> => {
  try {
    const db = await initDB()

    // Clear videos
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([VIDEO_STORE], 'readwrite')
      const store = transaction.objectStore(VIDEO_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Clear audio
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], 'readwrite')
      const store = transaction.objectStore(AUDIO_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error clearing DB:', error)
  }
}

// Check if video exists in DB
export const hasVideoInDB = async (): Promise<boolean> => {
  try {
    const video = await getVideoFromDB()
    return video !== null
  } catch {
    return false
  }
}
