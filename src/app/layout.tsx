import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Top-Occasion - Achetez et vendez en toute simplicité',
  description: 'Marketplace C2C pour l achat et la vente d articles d occasion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen justify-between`}>
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}