import { GeistSans } from 'geist/font/sans'
import './global.css'

export const metadata = {
  title: 'blackglass.tech',
  description: 'agentic systems for scientific work',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  )
}
