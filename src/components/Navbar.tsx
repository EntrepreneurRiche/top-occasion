'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600">
          <span>🏷️</span>
          <span>Top-Occasion</span>
        </Link>

        {/* Navigation principale */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link href="/annonces" className="hover:text-indigo-600 transition">
            Toutes les annonces
          </Link>
          {user && (
            <>
              <Link href="/mes-annonces" className="hover:text-indigo-600 transition">
                Mes annonces
              </Link>
              <Link href="/profil" className="hover:text-indigo-600 transition">
                Mon profil
              </Link>
            </>
          )}
        </nav>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/annonces/creer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
              >
                + Déposer une annonce
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 font-semibold hover:underline px-2 py-1"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-bold text-gray-700 hover:text-indigo-600 px-3 py-2 transition"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}