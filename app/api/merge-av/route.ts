import { NextRequest, NextResponse } from 'next/server'
import { tmpdir } from 'os'
import { mkdtemp, writeFile, readFile } from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

export const runtime = 'nodejs'

function buildAtempoChain(ratio: number): string {
  // Clamp invalid values
  if (!isFinite(ratio) || ratio <= 0) return 'atempo=1.0'
  const filters: string[] = []
  let r = ratio
  // Break ratio into factors within [0.5, 2.0] as atempo only supports this range
  while (r > 2.0 + 1e-9) {
    filters.push('atempo=2.0')
    r /= 2.0
  }
  while (r < 0.5 - 1e-9) {
    filters.push('atempo=0.5')
    r /= 0.5
  }
  filters.push(`atempo=${r.toFixed(6)}`)
  return filters.join(',')
}

async function runFfmpeg(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error('ffmpeg binary not found'))

    const proc = spawn(ffmpegPath as string, args)
    let stderr = ''
    proc.stderr.on('data', (d) => {
      stderr += d.toString()
    })
    proc.on('close', (code) => {
      if (code === 0) return resolve()
      reject(new Error(`ffmpeg failed (code ${code}): ${stderr}`))
    })
    proc.on('error', (err) => reject(err))
  })
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const video = form.get('video') as unknown as File
    const audio = form.get('audio') as unknown as File
    const videoDurationStr = (form.get('videoDuration') as string) || ''
    const audioDurationStr = (form.get('audioDuration') as string) || ''

    if (!video || !audio) {
      return NextResponse.json(
        { error: 'Missing video or audio file' },
        { status: 400 }
      )
    }

    // Read file buffers
    const [videoBuf, audioBuf] = await Promise.all([
      video.arrayBuffer().then((b) => Buffer.from(b)),
      audio.arrayBuffer().then((b) => Buffer.from(b)),
    ])

    // Prepare temp files
    const dir = await mkdtemp(path.join(tmpdir(), 'merge-av-'))
    const videoExt = (video.name && path.extname(video.name)) || ''
    const audioExt = (audio.name && path.extname(audio.name)) || ''
    const inVideoPath = path.join(dir, `input-video${videoExt || ''}`)
    const inAudioPath = path.join(dir, `input-audio${audioExt || ''}`)
    const outPath = path.join(dir, 'output.mp4')

    await writeFile(inVideoPath, videoBuf)
    await writeFile(inAudioPath, audioBuf)

    // Compute atempo ratio from provided durations (fallback to 1.0)
    const vdur = parseFloat(videoDurationStr)
    const adur = parseFloat(audioDurationStr)
    const ratio = isFinite(vdur) && vdur > 0 && isFinite(adur) && adur > 0 ? vdur / adur : 1.0
    const atempo = buildAtempoChain(ratio)

    // Build ffmpeg args: copy video, time-stretch audio, mux, stop at video end
    const ffArgs = [
      '-y',
      '-i', inVideoPath,
      '-i', inAudioPath,
      '-filter:a', atempo,
      '-map', '0:v:0',
      '-map', '1:a:0',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-shortest',
      outPath,
    ]

    await runFfmpeg(ffArgs)
    const merged = await readFile(outPath)

    return new NextResponse(new Uint8Array(merged), {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="output-with-voiceover.mp4"',
        'Content-Length': merged.byteLength.toString(),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error merging audio and video:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to merge: ${message}` }, { status: 500 })
  }
}

