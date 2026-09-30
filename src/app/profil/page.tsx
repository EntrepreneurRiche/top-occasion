'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      if (data) {
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
      }
      setLoading(false)
    }
const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('❌ Aucun utilisateur connecté.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })

    setSaving(false)

    if (error) {
      console.error('Erreur Supabase Profil:', error)
      setMessage(`❌ Erreur: ${error.message}`)
    } else {
      setMessage('✅ Profil mis à jour avec succès !')
    }
  }
    loadProfile()
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })

    setSaving(false)

    if (error) {
      setMessage('❌ Erreur lors de la mise à jour.')
    } else {
      setMessage('✅ Profil mis à jour avec succès !')
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement de votre profil...</div>
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-sm text-gray-500 mb-6">Mettez à jour vos informations de contact pour vos acheteurs.</p>

        {message && (
          <div className="mb-4 p-3 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Brahima Traore"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Numéro Téléphone / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +22370000000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow transition mt-2 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer le profil'}
          </button>
        </form>
      </div>
    </div>
  )
}