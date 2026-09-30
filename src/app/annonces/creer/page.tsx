'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Véhicules',
  'High-Tech & Électronique',
  'Maison & Équipement',
  'Mode & Accessoires',
  'Immobilier',
  'Autres'
]

export default function CreateListingPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [location, setLocation] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Vous devez être connecté pour publier une annonce.')
        router.push('/login')
        return
      }

      const imageUrls: string[] = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Erreur upload:', uploadError)
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath)

        if (publicUrlData?.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl)
        }
      }

      const { error } = await supabase.from('listings').insert([
        {
          title,
          description,
          price: parseFloat(price),
          category,
          location,
          images: imageUrls,
          image_url: imageUrls[0] || null,
          user_id: user.id,
          is_sold: false
        }
      ])

      if (error) {
        alert('Erreur : ' + error.message)
      } else {
        router.push('/mes-annonces')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Publier une nouvelle annonce</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
          <input
            type="text"
            required
            placeholder="Ex: Mercedes C200, iPhone 13..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
            <input
              type="number"
              required
              placeholder="Ex: 50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Localisation / Ville</label>
          <input
            type="text"
            placeholder="Ex: Bamako, Kéniéba..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            required
            placeholder="Décrivez votre article..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {files.length > 0 && (
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              📸 {files.length} photo(s) sélectionnée(s)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
        </button>
      </form>
    </div>
  )
}