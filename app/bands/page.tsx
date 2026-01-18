'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminBandsPage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    genre: '',
    origin: '',
    formed_year: ''
  })
  const [status, setStatus] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Saving...')

    const { error } = await supabase.from('bands').insert({
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
      setStatus('Band added successfully ✅')
      setForm({
        name: '',
        slug: '',
        genre: '',
        origin: '',
        formed_year: ''
      })
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Add Band</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['name', 'Band Name'],
          ['slug', 'Slug (radiohead)'],
          ['genre', 'Genre'],
          ['origin', 'Origin'],
          ['formed_year', 'Formed Year']
        ].map(([name, label]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            value={(form as any)[name]}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        ))}

        const {
        data: { user },
        } = await supabase.auth.getUser()

        await supabase.from("bands").insert({
          name: "Neurosis",
          slug: "neurosis",
          user_id: user?.id,
        })

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
        >
          Save Band
        </button>
      </form>

      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}

