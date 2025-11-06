import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

const denton = localFont({
  src: [
    {
      path: '../public/fonts/DentonTest-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/DentonTest-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/DentonTest-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-denton',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VoiceGPT - AI-Powered Multi-Language Video Narration',
  description: 'Transform any video into professional AI-narrated content in 10+ languages. Upload, select voice, and get perfect audio-video sync automatically.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} ${denton.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
