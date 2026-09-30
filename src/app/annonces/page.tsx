'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AnnoncesPage() {
  const [listings, setListings] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  async function fetchData() {
    setLoading(true)
    
    // Récupérer les catégories
    const { data: catData } = await supabase.from('categories').select('*')
    if (catData) setCategories(catData)

    // Récupérer les annonces
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    const { data: listData } = await query
    if (listData) setListings(listData)
    setLoading(false)
  }

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des annonces */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Chargement des annonces...</p>
      ) : filteredListings.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Aucune annonce trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <Link
              key={item.id}
              href={`/annonces/${item.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col relative group"
            >
              {/* Image + Badge VENDU */}
              <div className="relative h-48 bg-gray-100 w-full">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Pas d'image
                  </div>
                )}

                {/* BADGE VENDU */}
                {item.is_sold && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wider">
                    VENDU
                  </div>
                )}
              </div>

              {/* Infos annonce */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xl font-black text-indigo-600 mt-1">
                    {Number(item.price).toLocaleString()} FCFA
                  </p>
                </div>

                <div className="mt-4 text-xs text-gray-500 flex items-center justify-between border-t pt-3">
                  <span>📍 {item.location || 'Mali'}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}