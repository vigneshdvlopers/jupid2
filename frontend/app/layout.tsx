import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

export const metadata: Metadata = {
  title: "Jupid AI | Premium Competitor Analysis",
  description: "AI-powered market intelligence for elite enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-background text-foreground overflow-hidden">
        <div className="flex h-screen w-full">
          {/* Sidebar - Fixed on desktop */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
