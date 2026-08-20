import type { Metadata } from 'next';
import './globals.css';

const TITLE = 'ScanFlow - Book Price Comparison';
const DESCRIPTION = 'Compare used book prices and buyback offers across multiple vendors by ISBN.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
  },
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
