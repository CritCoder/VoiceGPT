import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server'

const FILE_PROCESS_TIMEOUT_MS = 2 * 60 * 1000
const FILE_PROCESS_POLL_INTERVAL_MS = 2000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const waitForGeminiFileReady = async (
  fileManager: GoogleAIFileManager,
  fileName: string
) => {
  const startedAt = Date.now()
  let latestMetadata = await fileManager.getFile(fileName)
  console.log(
    '⏳ [Gemini Video Analysis] Uploaded file state:',
    latestMetadata.state
  )

  while (latestMetadata.state === FileState.PROCESSING) {
    if (Date.now() - startedAt > FILE_PROCESS_TIMEOUT_MS) {
      throw new Error(
        'Timed out while waiting for Gemini to process the uploaded video.'
      )
    }

    await sleep(FILE_PROCESS_POLL_INTERVAL_MS)
    latestMetadata = await fileManager.getFile(fileName)
    console.log(
      '⏳ [Gemini Video Analysis] Waiting for Gemini file...',
      latestMetadata.state
    )
  }

  if (latestMetadata.state === FileState.FAILED) {
    throw new Error(
      latestMetadata.error?.message ||
        'Gemini failed to process the uploaded video file.'
    )
  }

  if (!latestMetadata.uri) {
    throw new Error('Gemini did not return a file URI for the uploaded video.')
  }

  return latestMetadata
}

export async function POST(request: NextRequest) {
  let uploadedFileName: string | null = null
  let fileManager: GoogleAIFileManager | null = null

  const cleanupGeminiFile = async () => {
    if (!uploadedFileName || !fileManager) return
    try {
      await fileManager.deleteFile(uploadedFileName)
      console.log(
        '🧹 [Gemini Video Analysis] Deleted temporary Gemini file:',
        uploadedFileName
      )
    } catch (cleanupError) {
      console.warn(
        '⚠️ [Gemini Video Analysis] Failed to delete Gemini file:',
        cleanupError
      )
    } finally {
      uploadedFileName = null
    }
  }

  try {
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const prompt = formData.get('prompt') as string
    const language = formData.get('language') as string || 'en'
    const languageName = formData.get('languageName') as string || 'English'
    const videoDuration = parseFloat(formData.get('videoDuration') as string || '0')

    console.log('🎬 [Gemini Video Analysis] Starting video analysis...')
    console.log('📝 [Gemini Video Analysis] User prompt:', prompt)
    console.log('🌍 [Gemini Video Analysis] Target language:', languageName, `(${language})`)
    console.log('📹 [Gemini Video Analysis] Video file:', videoFile?.name)
    console.log('📊 [Gemini Video Analysis] Video size:', videoFile?.size ? `${(videoFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown')
    console.log('⏱️ [Gemini Video Analysis] Video duration:', videoDuration > 0 ? `${videoDuration.toFixed(2)} seconds` : 'Unknown')

    if (!videoFile || !prompt) {
      return NextResponse.json(
        { error: 'Missing video file or prompt' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const manager = new GoogleAIFileManager(apiKey)
    fileManager = manager
    // Using gemini-2.0-flash-exp for direct video analysis (no frame extraction needed)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
    const mimeType = videoFile.type || 'video/mp4'

    console.log('🤖 [Gemini Video Analysis] Model: gemini-2.0-flash-exp')
    console.log('🖼️ [Gemini Video Analysis] Video MIME type:', mimeType)
    console.log(
      '📦 [Gemini Video Analysis] Video buffer size:',
      `${(videoBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`
    )

    console.log('📤 [Gemini Video Analysis] Uploading video to Gemini Files API')
    const uploadResponse = await manager.uploadFile(videoBuffer, {
      displayName: videoFile.name,
      mimeType,
    })
    uploadedFileName = uploadResponse.file.name
    let uploadedFileUri = uploadResponse.file.uri

    if (uploadResponse.file.state === FileState.PROCESSING) {
      const readyFile = await waitForGeminiFileReady(manager, uploadResponse.file.name)
      uploadedFileUri = readyFile.uri
    }

    if (!uploadedFileUri) {
      throw new Error('Gemini file URI missing after upload.')
    }

    const durationInstructions = videoDuration > 0 
      ? `\n\nVIDEO DURATION: The video is ${videoDuration.toFixed(2)} seconds (${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}) long. Your narration should fit naturally within this duration. Create a transcript that, when spoken naturally in ${languageName}, will last approximately ${videoDuration.toFixed(0)} seconds. Pace your content accordingly - don't rush or drag.`
      : ''

    const systemPrompt = `You are an expert video narrator. The user wants to explain: "${prompt}"
${durationInstructions}

CRITICAL REQUIREMENTS:
1. You MUST write the ENTIRE transcript in ${languageName} language
2. Every word, sentence, and phrase must be in ${languageName}
3. The transcript length should naturally match the video duration when spoken
4. Output ONLY a JSON object with this exact structure:

{
  "transcript": "Complete transcript in ${languageName} without timestamps, ready for text-to-speech",
  "timestamps": [
    {"time": "00:00", "text": "First sentence in ${languageName}"},
    {"time": "00:05", "text": "Second sentence in ${languageName}"},
    {"time": "00:10", "text": "Third sentence in ${languageName}"}
  ]
}

Content Requirements:
1. "transcript" field: Clean text in ${languageName} WITHOUT timestamps, ready for ElevenLabs TTS
2. "timestamps" field: Array with "time" (MM:SS) and "text" (sentences in ${languageName})
3. Write as professional product explainer focusing on VALUE and BENEFITS
4. Use second person perspective (appropriate for ${languageName})
5. Engaging, conversational tone that builds excitement
6. Focus on what users accomplish and why it matters
7. Each timestamp entry should be a complete, natural sentence in ${languageName}
8. Distribute timestamps evenly across the video duration

LANGUAGE REQUIREMENT: Everything must be in ${languageName} - no English words unless they are proper nouns or technical terms commonly used in ${languageName}.

DURATION MATCHING: The spoken narration should naturally fit the video length. Adjust content density accordingly.

Output ONLY the JSON object, nothing else.`

    console.log('🤖 [Gemini Video Analysis] System prompt length:', systemPrompt.length)

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadedFileUri,
          mimeType,
        },
      },
      {
        text: systemPrompt,
      },
    ])

    const response = await result.response
    const rawResponse = response.text()

    console.log('✅ [Gemini Video Analysis] Response received')
    console.log('📝 [Gemini Video Analysis] Raw response length:', rawResponse.length)
    console.log('📝 [Gemini Video Analysis] Raw response preview:', rawResponse.substring(0, 200) + '...')

    if (!rawResponse) {
      return NextResponse.json(
        { error: 'No response generated from Gemini API' },
        { status: 500 }
      )
    }

    try {
      // Strip markdown code block wrapper if present
      let cleanedResponse = rawResponse.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '')
      }
      
      // Parse the JSON response from Gemini
      const parsedResponse = JSON.parse(cleanedResponse)
      
      if (!parsedResponse.transcript || !parsedResponse.timestamps) {
        throw new Error('Invalid JSON structure from Gemini')
      }

      console.log('✅ [Gemini Video Analysis] JSON parsed successfully')
      console.log('📝 [Gemini Video Analysis] Clean transcript length:', parsedResponse.transcript.length)
      console.log('📊 [Gemini Video Analysis] Number of timestamps:', parsedResponse.timestamps.length)

      return NextResponse.json({ 
        transcript: parsedResponse.transcript,
        timestamps: parsedResponse.timestamps,
        videoName: videoFile.name,
        videoSize: videoFile.size,
        videoType: mimeType
      })
    } catch (parseError) {
      console.error('❌ [Gemini Video Analysis] JSON parse error:', parseError)
      console.error('📝 [Gemini Video Analysis] Raw response that failed to parse:', rawResponse)
      
      return NextResponse.json(
        { error: 'Failed to parse Gemini response as JSON. The AI may not have followed the format instructions.' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error analyzing video with Gemini:', error)
    
    // Handle specific Gemini API errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.' },
        { status: 401 }
      )
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Gemini API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (error?.status === 400) {
      return NextResponse.json(
        { error: `Gemini API error: ${error?.message || 'Bad request'}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: `Failed to analyze video with Gemini: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  } finally {
    await cleanupGeminiFile()
  }
}
