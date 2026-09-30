import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Marque & Slogan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-black text-xl text-white">
            <span>🏷️</span>
            <span>Top-Occasion</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            La marketplace C2C simple et sécurisée pour acheter et vendre vos articles de seconde main, où que vous soyez.
          </p>
        </div>

        {/* Liens Rapides */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/annonces" className="hover:text-indigo-400 transition">
                Toutes les annonces
              </Link>
            </li>
            <li>
              <Link href="/annonces/creer" className="hover:text-indigo-400 transition">
                Déposer une annonce
              </Link>
            </li>
            <li>
              <Link href="/profil" className="hover:text-indigo-400 transition">
                Mon profil
              </Link>
            </li>
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Plateforme</h4>
          <p className="text-sm text-gray-400 mb-2">
            Mise en relation directe entre particuliers par téléphone et WhatsApp.
          </p>
          <span className="inline-block text-xs font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
            🌍 Marketplace Internationale
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Top-Occasion. Tous droits réservés.
      </div>
    </footer>
  )
}