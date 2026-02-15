import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ExpenseProvider } from '@/context/ExpenseContext';
import Navigation from '@/components/Navigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'ExpenseTracker - Personal Finance Manager',
  description: 'Track and manage your personal expenses with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ExpenseProvider>
          <div className="min-h-screen">
            <Navigation />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
          </div>
        </ExpenseProvider>
      </body>
    </html>
  );
}
