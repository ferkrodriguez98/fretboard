import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fretboard Interactivo',
  description: 'Creado por elfermins',
  generator: 'elfermins',
  icons: {
    icon: '/jazz_music_favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
