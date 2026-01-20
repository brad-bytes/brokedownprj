'use client'

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function BandsForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    genre: "",
    origin: "",
    formed_year: ""
  })
  const [status, setStatus] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("Saving...")

    const { error } = await supabaseBrowser.from("bands").insert({
      name: form.name,
      slug: form.slug.toLowerCase(),
      genre: form.genre,
      origin: form.origin,
      formed_year: form.formed_year
        ? Number(form.formed_year)
        : null
    })

    if (error) {
      setStatus(error.message)
    } else {
      setStatus("Band added successfully ✅")
      setForm({
        name: "",
        slug: "",
        genre: "",
        origin: "",
        formed_year: ""
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} />
      <input name="formed_year" placeholder="Formed year" value={form.formed_year} onChange={handleChange} />
      <button type="submit">Add band</button>
      {status && <p>{status}</p>}
    </form>
  )
}

