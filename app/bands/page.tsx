import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import BandsForm from "./BandsForm"

export default async function AdminBandsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔐 Admin gate
  if (!user) {
    redirect("/login")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin · Bands</h1>
      <BandsForm />
    </div>
  )
}

