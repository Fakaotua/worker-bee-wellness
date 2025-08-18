import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worker Bee Wellness - Connect with Licensed Massage Therapists",
  description: "Book professional massage therapy sessions with licensed therapists in your area. Quality wellness services at your fingertips.",
  keywords: "massage therapy, licensed therapists, wellness, booking, relaxation",
  openGraph: {
    title: "Worker Bee Wellness",
    description: "Connect with licensed massage therapists in your area",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
