import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { imageData, prompt } = await request.json()

    console.log('🔍 [Gemini Frame Analysis] Starting frame analysis...')
    console.log('📝 [Gemini Frame Analysis] User prompt:', prompt)
    console.log('🖼️ [Gemini Frame Analysis] Image data length:', imageData?.length || 'No image data')
    console.log('🖼️ [Gemini Frame Analysis] Image format:', imageData?.substring(0, 50) + '...' || 'No image data')

    if (!imageData || !prompt) {
      return NextResponse.json(
        { error: 'Missing imageData or prompt' },
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Convert data URL to base64 string for Gemini
    const base64Data = imageData.split(',')[1]
    
    const systemPrompt = `You are analyzing a video frame to help create relevant narration. The user has specified their goal: "${prompt}"

Your task:
1. Analyze what's visible in this frame
2. Identify elements that are relevant to the user's stated goal
3. Focus on details that would support their communication objective
4. Provide specific, actionable descriptions that will help create relevant narration

Be specific about visual elements, actions, objects, and settings that relate to their purpose.`

    console.log('🤖 [Gemini Frame Analysis] System prompt:', systemPrompt)
    console.log('🎯 [Gemini Frame Analysis] Model: gemini-1.5-flash')
    console.log('🖼️ [Gemini Frame Analysis] Base64 data length:', base64Data?.length || 'No base64 data')
    
    const result = await model.generateContent([
      {
        text: systemPrompt,
      },
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = await result.response
    const analysis = response.text()

    console.log('✅ [Gemini Frame Analysis] Response received')
    console.log('💬 [Gemini Frame Analysis] Analysis result:', analysis.substring(0, 200) + '...')

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis generated from Gemini API' },
        { status: 500 }
      )
    }

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Error analyzing frame with Gemini:', error)
    
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
      { error: `Failed to analyze frame with Gemini: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
