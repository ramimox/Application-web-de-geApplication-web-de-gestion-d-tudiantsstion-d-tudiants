import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Student Management App',
  description: 'Manage your students with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Student Management
            </Link>
            <Link 
              href="/add-student" 
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Add Student
            </Link>
          </div>
        </nav>
        <main className="container mx-auto mt-8 px-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}