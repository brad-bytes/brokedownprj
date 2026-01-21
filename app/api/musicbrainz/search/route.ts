import { NextResponse } from "next/server"

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    )
  }

  const url = `${MUSICBRAINZ_BASE}/artist/?query=${encodeURIComponent(
    query
  )}&fmt=json&limit=10`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "BrokedownDiscography/1.0 (contact@yourdomain.com)",
    },
    // MusicBrainz prefers no caching for search
    cache: "no-store",
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "MusicBrainz request failed" },
      { status: 500 }
    )
  }

  const data = await res.json()

  const results = (data.artists || []).map((artist: any) => ({
    mbid: artist.id,
    name: artist.name,
    country: artist.country ?? null,
    disambiguation: artist.disambiguation ?? null,
    formed_year: artist["life-span"]?.begin
      ? Number(artist["life-span"].begin.slice(0, 4))
      : null,
    type: artist.type ?? null,
  }))

  return NextResponse.json(results)
}

