import { Toaster } from "sonner";

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import QueryProviders from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <QueryProviders>
            {children}
          </QueryProviders>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
