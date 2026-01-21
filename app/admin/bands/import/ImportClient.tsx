"use client"

import { useState } from "react"
import type { MusicBrainzArtist } from "./types"

export default function ImportClient() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MusicBrainzArtist[]>([])
  const [selected, setSelected] = useState<MusicBrainzArtist | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSelected(null)

    try {
      const res = await fetch(
        `/api/musicbrainz/search?query=${encodeURIComponent(query)}`
      )
      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError("Could not fetch results")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
      {/* Left column: search + results */}
      <div>
        <form onSubmit={handleSearch}>
          <input
            placeholder="Search band name"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ marginTop: 20 }}>
          {results.map(band => (
            <li
              key={band.mbid}
              style={{
                cursor: "pointer",
                padding: 8,
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => setSelected(band)}
            >
              <strong>{band.name}</strong>
              {band.country && ` · ${band.country}`}
              {band.disambiguation && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {band.disambiguation}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right column: preview */}
      <div>
        {selected ? (
          <>
            <h2>Preview</h2>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Country:</strong> {selected.country ?? "—"}</p>
            <p><strong>Formed:</strong> {selected.formed_year ?? "—"}</p>
            <p><strong>Type:</strong> {selected.type ?? "—"}</p>
            <p><strong>MBID:</strong> {selected.mbid}</p>

            <p style={{ fontSize: 12, opacity: 0.7 }}>
              This data is from MusicBrainz and has not been imported yet.
            </p>
          </>
        ) : (
          <p>Select a band to preview details</p>
        )}
      </div>
    </div>
  )
}

