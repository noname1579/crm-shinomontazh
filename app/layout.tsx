import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar, MobileNav } from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'ШиноСклад — CRM для шиномонтажа',
  description: 'Учёт склада и аналитика',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Sidebar />
        <MobileNav />
        <div className="pb-20 lg:pb-0 lg:pl-64">
          <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}