import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kazi - AI-Matched Work for Nigeria',
  description: 'Kazi connects skilled workers with clients across Nigeria. AI-matched, Squad-powered, built for the informal economy.',
  generator: 'v0.app',
  openGraph: {
    images: ['https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/9dcd1376-8630-4cba-aaf9-c8030ffc44ff-ChatGPT%20Image%20May%2016,%202026,%2003_43_43%20AM%20(1).png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/9dcd1376-8630-4cba-aaf9-c8030ffc44ff-ChatGPT%20Image%20May%2016,%202026,%2003_43_43%20AM%20(1).png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
