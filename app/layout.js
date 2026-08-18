import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* CSS KaTeX */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        {children}

        {/* JS KaTeX & Auto-Render */}
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}