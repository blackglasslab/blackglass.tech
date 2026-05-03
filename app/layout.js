export const metadata = {
  title: 'blackglass.tech',
  description: 'Blackglass Technology',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
