import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, language, videoDuration } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text' },
        { status: 400 }
      )
    }

    // Text is already clean from Gemini (no timestamps to strip)
    const cleanText = text.trim()
    
    console.log('🎵 [Audio Generation] Text length:', cleanText.length)
    console.log('🎵 [Audio Generation] Text preview:', cleanText.substring(0, 200) + '...')
    console.log('🎵 [Audio Generation] Voice ID:', voiceId || 'default')
    console.log('🎵 [Audio Generation] Language:', language || 'en')
    console.log('⏱️ [Audio Generation] Target video duration:', videoDuration ? `${videoDuration}s` : 'Not specified')

    const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
    if (!apiKey) {
      console.error('❌ [Audio Generation] ELEVENLABS_API_KEY is missing or empty')
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }
    
    console.log('🔑 [Audio Generation] API key length:', apiKey.length)
    console.log('🔑 [Audio Generation] API key starts with:', apiKey.substring(0, 5))

    // Use provided voice ID or fallback to default
    const selectedVoiceId = voiceId || 'JBFqnCBsd6RMkjVDRZzb'
    
    // Use multilingual model for better language support
    const modelId = 'eleven_multilingual_v2'

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: modelId,
        }),
      }
    )

    if (!response.ok) {
      let errorMessage = 'Failed to generate audio'
      let errorDetails = ''
      
      try {
        const errorData = await response.json()
        console.error('ElevenLabs API error response:', errorData)
        
        if (errorData.detail) {
          errorDetails = errorData.detail
        } else if (errorData.message) {
          errorDetails = errorData.message
        } else if (errorData.error) {
          errorDetails = errorData.error
        }
        
        // Handle specific ElevenLabs error cases
        if (response.status === 401) {
          errorMessage = 'Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY environment variable.'
        } else if (response.status === 429) {
          errorMessage = 'ElevenLabs API rate limit exceeded. Please try again later.'
        } else if (response.status === 422) {
          errorMessage = 'Invalid request parameters. The text might be too long or contain unsupported characters.'
        } else if (response.status === 500) {
          errorMessage = 'ElevenLabs server error. Please try again later.'
        } else {
          errorMessage = `ElevenLabs API error (${response.status}): ${errorDetails || 'Unknown error'}`
        }
      } catch (parseError) {
        const errorText = await response.text()
        console.error('ElevenLabs API error (non-JSON):', errorText)
        errorMessage = `ElevenLabs API error (${response.status}): ${errorText || 'Unknown error'}`
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating audio:', error)
    
    let errorMessage = 'Failed to generate audio'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to ElevenLabs API. Please check your internet connection.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout: ElevenLabs API took too long to respond. Please try again.'
      } else {
        errorMessage = `Error: ${error.message}`
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
