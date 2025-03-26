'use client';
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import NavbarUse from "@/components/Navbar";
import SessionWrapper from '@/components/SessionWrapper'
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/app/context/Userinfo';
import GetUserInfo from '@/components/GetUserInfo'; 
import { RoadmapProvider } from "@/app/context/RoadmapContext";
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './context/AuthContext';
// import ChatAssistant from "@/components/search/ChatAssistant";
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Website",
//   description: "Website",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      {/* <head>
        <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png"/>
      </head> */}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
           <Image src="/logo.png" alt="logo" width={100} height={100} />
          </div>
        ) : (
          <SessionProvider>
            <AuthProvider>
              <UserProvider>
                <RoadmapProvider> {/* Wrap the children with RoadmapProvider */}
                  <main className="bg-black min-h-screen">
                    <SessionWrapper>
                      <NavbarUse />
                      <GetUserInfo />
                      <div className="relative z-10 overflow-auto">
                        {children}
                        <Analytics />
                      </div>
                    </SessionWrapper>
                  </main>
                  <Toaster />
                </RoadmapProvider> {/* End of RoadmapProvider */}
                <Footer />
              </UserProvider>
            </AuthProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
