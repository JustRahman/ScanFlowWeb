import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScanFlow - Book Arbitrage Finder',
  description: 'Find profitable book deals from eBay wholesale sellers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
