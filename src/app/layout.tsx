import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SidebarProvider } from "@/contexts/SidebarContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6">
              {children}
            </main>
            <Footer />
          </div>
          {/* Global floating chat assistant */}
          <FloatingChatWidget />
        </SidebarProvider>
      </body>
    </html>
  );
}
