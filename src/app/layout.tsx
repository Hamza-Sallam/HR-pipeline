import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/contexts/language-context';
import { RTLProvider } from '@/contexts/rtl-context';

export const metadata: Metadata = {
  title: 'SmartGaters',
  description: 'AI-Powered HR Assistant',
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased font-body')}>
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div>Loading...</div></div>}>
          <LanguageProvider>
            <RTLProvider>
              {children}
              <Toaster />
            </RTLProvider>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}

    