'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category?: string
  location?: string
  image_url?: string | null
  images?: string[] | null
  is_sold: boolean
  created_at: string
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMyListings()
  }, [])

  async function fetchMyListings() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors du chargement des annonces:', error)
    } else if (data) {
      setListings(data)
    }
    setLoading(false)
  }

  // Basculer l'état Vendu / Disponible
  const toggleSoldStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('listings')
      .update({ is_sold: !currentStatus })
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la mise à jour : ' + error.message)
    } else {
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_sold: !currentStatus } : item
        )
      )
    }
  }

  // Supprimer une annonce
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la suppression : ' + error.message)
    } else {
      setListings((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes annonces</h1>
          <p className="text-gray-600 mt-1">Gérez vos articles mis en vente</p>
        </div>
        <Link
          href="/annonces/creer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
        >
          + Publier une annonce
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement de vos annonces...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'annonce.</p>
          <Link
            href="/annonces/creer"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Créer votre première annonce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const imageUrl = item.image_url || (item.images && item.images.length > 0 ? item.images[0] : null)

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
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

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-xl font-extrabold text-indigo-600 mb-2">
                      {item.price.toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
                  <button
                    onClick={() => toggleSoldStatus(item.id, item.is_sold)}
                    className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition ${
                      item.is_sold
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {item.is_sold ? 'Marquer disponible' : 'Marquer comme vendu'}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold py-2 px-3 rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}