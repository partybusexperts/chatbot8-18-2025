import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Party Bus Quoting Chatbot',
  description: 'Agent quoting tool for party bus and limo rentals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-50 min-h-screen'}>{children}</body>
    </html>
  );
}
