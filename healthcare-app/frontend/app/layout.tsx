import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "DocNear - Instant Healthcare Financing with EMI",
  description: "Get immediate EMI approval for medical expenses. Access quality healthcare with flexible payment options.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
