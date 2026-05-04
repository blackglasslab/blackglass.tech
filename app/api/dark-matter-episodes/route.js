import fs from 'fs'
import path from 'path'

// Episode metadata lives in a JSON file alongside the audio
const EPISODES_FILE = path.join(process.cwd(), 'public', 'podcasts', 'episodes.json')

export async function GET() {
  if (!fs.existsSync(EPISODES_FILE)) {
    return Response.json({ episodes: [] })
  }

  const raw = fs.readFileSync(EPISODES_FILE, 'utf-8')
  const data = JSON.parse(raw)

  // Add full audio URLs for the frontend player
  const episodes = (data.episodes || []).map((ep, i) => ({
    ...ep,
    audioUrl: `/podcasts/${ep.filename}`,
  }))

  return Response.json({ episodes })
}
