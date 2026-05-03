export const metadata = {
  title: 'blackglass.tech',
  description: 'agentic systems for scientific work',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>{children}</body>
    </html>
  )
}
