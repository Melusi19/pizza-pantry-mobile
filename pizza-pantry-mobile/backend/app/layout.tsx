import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pizza Pantry API',
  description: 'Backend API for Pizza Pantry Mobile App',
  keywords: ['inventory', 'management', 'pizza', 'restaurant'],
  authors: [{ name: 'Pizza Pantry Team' }],
  creator: 'Pizza Pantry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h1 className="text-2xl font-bold text-gray-900">
                        🍕 Pizza Pantry
                      </h1>
                    </div>
                    <nav className="ml-10 flex space-x-8">
                      <a
                        href="/"
                        className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Home
                      </a>
                      <a
                        href="/api-docs"
                        className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        API Docs
                      </a>
                      <a
                        href="/health"
                        className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Health
                      </a>
                    </nav>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      API Server
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Pizza Pantry. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a
                      href="/privacy"
                      className="text-gray-400 hover:text-gray-500 text-sm"
                    >
                      Privacy
                    </a>
                    <a
                      href="/terms"
                      className="text-gray-400 hover:text-gray-500 text-sm"
                    >
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}