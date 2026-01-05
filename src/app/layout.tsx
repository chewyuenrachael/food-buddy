import type { Metadata, Viewport } from 'next';
import { ToastProvider } from '@/components/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Food Buddy - The Local\'s Guide to Singapore Food',
  description:
    'Discover the best local food in Singapore with curated lists from locals and food influencers.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
