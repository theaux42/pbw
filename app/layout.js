import './globals.css'
import NavBar from './NavBar'

export const metadata = {
  title: 'XRPact Site',
  description: 'Exemple Next.js 13 + Xumm + Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="
        bg-gradient-to-b 
        from-indigo-900 
        via-blue-900 
        to-teal-900 
        text-gray-100
        min-h-screen
      ">
        <NavBar />
        <div className="max-w-6xl mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
