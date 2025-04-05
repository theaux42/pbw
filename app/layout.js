import './globals.css'

export const metadata = {
  title: 'XRPact',
  description: 'Plateforme de dons en XRP pour les associations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}