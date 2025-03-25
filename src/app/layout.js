import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Addictive Affiliates",
  description: "Track, optimize, and scale your campaigns with ease.",
  openGraph: {
    title: "Addictive Affiliates",
    description: "Track, optimize, and scale your campaigns with ease.",
    images: [
      {
        url: "/logo.png", 
        width: 1200,
        height: 630,
        alt: "Addictive Affiliates Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
