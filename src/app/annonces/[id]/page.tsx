'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ListingDetail {
  id: string
  title: string
  description?: string
  price: number
  category?: string
  location?: string
  image_url?: string | null
  images?: string[] | null
  is_sold?: boolean
  created_at: string
  user_id: string
  profiles?: {
    full_name?: string
    phone?: string
  } | null
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListing() {
      if (!params?.id) return

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            full_name,
            phone
          )
        `)
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setListing(data)
        const mainImg = data.image_url || (data.images && data.images.length > 0 ? data.images[0] : null)
        setActiveImage(mainImg)
      }
      setLoading(false)
    }

    fetchListing()
  }, [params?.id])

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement de l'annonce...</div>
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Annonce introuvable</h1>
        <Link href="/annonces" className="text-indigo-600 font-bold hover:underline">
          ← Retourner à la liste des annonces
        </Link>
      </div>
    )
  }

  const allImages = listing.images && listing.images.length > 0 
    ? listing.images 
    : listing.image_url 
      ? [listing.image_url] 
      : []

  const phone = listing.profiles?.phone || ''
  const formattedPhone = phone.replace(/\s+/g, '')
  const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone.replace('+', '')}?text=Bonjour, je suis intéressé par votre annonce "${listing.title}" sur Top-Occasion.` : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Bouton Retour */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-indigo-600 font-semibold text-sm flex items-center gap-1 transition"
        >
          ← Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Galerie d'images & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image principale */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative w-full h-80 sm:h-96 bg-gray-100 flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">Aucune image disponible</span>
              )}

              {listing.is_sold && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-600 text-white font-black text-sm uppercase tracking-wider px-4 py-1.5 rounded shadow">
                    Article Vendu
                  </span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-100">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === img ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {listing.description || 'Aucune description fournie pour cet article.'}
            </p>
          </div>
        </div>

        {/* Colonne Droite : Prix, Détails & Actions Vendeur */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div>
              {listing.category && (
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                  {listing.category}
                </span>
              )}
              <h1 className="text-2xl font-extrabold text-gray-900 mt-2">{listing.title}</h1>
              <p className="text-3xl font-black text-indigo-600 mt-3">
                {listing.price.toLocaleString()} FCFA
              </p>
            </div>

            <div className="border-t border-b border-gray-100 py-4 space-y-2 text-sm text-gray-600">
              {listing.location && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="font-medium text-gray-800">{listing.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Publié le {new Date(listing.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Infos Vendeur & Boutons de contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Contacter le vendeur
              </h3>

              <div className="p-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-800">
                👤 {listing.profiles?.full_name || 'Vendeur Top-Occasion'}
              </div>

              {phone ? (
                <div className="space-y-2 pt-2">
                  <a
                    href={`tel:${formattedPhone}`}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                  >
                    📞 Appeler le {phone}
                  </a>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                    >
                      💬 Discuter sur WhatsApp
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
                  ⚠️ Le vendeur n'a pas renseigné son numéro de téléphone.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}