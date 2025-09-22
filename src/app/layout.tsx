import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
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
      <body className="bg-[#F5F7FA] text-[#2C3E50]">
        <SidebarProvider>
          <Sidebar />
          <LayoutWrapper>
            <Header />
            <main className="flex-1 p-4">
              {children}
            </main>
            <Footer />
          </LayoutWrapper>
          {/* Global floating chat assistant */}
          <FloatingChat />
        </SidebarProvider>
      </body>
    </html>
  );
}
