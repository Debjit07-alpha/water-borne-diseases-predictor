import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "River Pulse — Water-Borne Disease Prevention & Monitoring Platform",
  description: "AI-powered disease identification, risk mapping, and community health surveillance for water-borne diseases including Cholera, Typhoid, Hepatitis A, and more.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className="bg-white text-gray-900 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <LayoutWrapper>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </LayoutWrapper>
              {/* Global floating chat assistant */}
              <FloatingChatWidget />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
