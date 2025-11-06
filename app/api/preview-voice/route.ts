import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { voiceId, text, modelId } = await request.json()

    if (!voiceId || !text) {
      return NextResponse.json(
        { error: 'Missing voiceId or text' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
    if (!apiKey) {
      console.error('❌ [Voice Preview] ELEVENLABS_API_KEY is missing or empty')
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    console.log('🎧 [Voice Preview] Generating preview for voice:', voiceId)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId || 'eleven_multilingual_v2',
        }),
      }
    )

    if (!response.ok) {
      console.error('❌ [Voice Preview] ElevenLabs API error:', response.status)
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || 'Failed to generate preview' },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    console.log('✅ [Voice Preview] Preview generated successfully')

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('❌ [Voice Preview] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}

