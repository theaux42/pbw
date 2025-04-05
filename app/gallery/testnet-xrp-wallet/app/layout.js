import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'XRPL Wallet Explorer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[#0D0D12] text-white"}>{children}</body>
    </html>
  )
}
