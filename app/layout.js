import './globals.css'
import NavBar from './NavBar'

export const metadata = {
  title: 'XRPact Site',
  description: 'Exemple Next.js 13 + Xumm',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-800">
        <NavBar />
        {children}
      </body>
    </html>
  )
}
