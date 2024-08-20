import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Provider from '@/components/Provider';
import QueryProvider from '@/components/QueryProvider';
import StoreProvider from '@/components/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beincom',
  description: 'Beincom made by Teddy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflow: 'hidden' }}>
      <body className={inter.className}>
        <Provider>
          <StoreProvider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem>
                <Toaster></Toaster>
                {children}
              </ThemeProvider>
            </QueryProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
