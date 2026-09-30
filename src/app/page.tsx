'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Listing {
  id: string
  title: string
  price: number
  category?: string
  location?: string
  image_url?: string | null
  images?: string[] | null
  is_sold?: boolean
  created_at: string
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error && data) {
        setListings(data)
      }
      setLoading(false)
    }

    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-500 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Achetez et vendez en toute simplicité <span className="text-amber-300">où que vous soyez</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 font-medium">
            Trouvez les meilleures affaires d'occasion près de chez vous ou donnez une seconde vie à vos objets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/annonces"
              className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-gray-100 transition"
            >
              Exploration des annonces
            </Link>
            <Link
              href="/annonces/creer"
              className="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              + Déposer une annonce
            </Link>
          </div>
        </div>
      </section>

      {/* Section Dernières Annonces */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Dernières opportunités</h2>
            <p className="text-gray-500 text-sm mt-1">Les plus récents articles mis en ligne</p>
          </div>
          <Link
            href="/annonces"
            className="text-indigo-600 font-bold hover:underline text-sm hidden sm:inline-block"
          >
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement des annonces...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 mb-4">Aucune annonce disponible pour le moment.</p>
            <Link href="/annonces/creer" className="text-indigo-600 font-bold hover:underline">
              Soyez le premier à publier !
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => {
              const imageUrl = item.image_url || (item.images && item.images.length > 0 ? item.images[0] : null)

              return (
                <Link
                  key={item.id}
                  href={`/annonces/${item.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Pas d'image</span>
                      )}

                      {item.is_sold && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1 rounded shadow">
                            Vendu
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      {item.category && (
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-lg mt-1 line-clamp-1 group-hover:text-indigo-600 transition">
                        {item.title}
                      </h3>
                      <p className="text-xl font-black text-indigo-600 mt-2">
                        {item.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  {item.location && (
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                      📍 {item.location}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/annonces"
            className="inline-block bg-indigo-50 text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-100 transition text-sm"
          >
            Voir toutes les annonces →
          </Link>
        </div>
      </section>
    </div>
  )
}