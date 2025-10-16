import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    console.log('🎤 [Get Voices] Fetching available voices from ElevenLabs...')

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    })

    if (!response.ok) {
      console.error('❌ [Get Voices] ElevenLabs API error:', response.status)
      return NextResponse.json(
        { error: 'Failed to fetch voices from ElevenLabs' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ [Get Voices] Successfully fetched', data.voices?.length || 0, 'voices')

    return NextResponse.json({ voices: data.voices || [] })
  } catch (error) {
    console.error('❌ [Get Voices] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}

