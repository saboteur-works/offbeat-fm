import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import StoreProvider from "./StoreProvider";
import Header from "./login/Header";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
import { plexSans, plexCondensed, plexMono, plexSerif } from "@/fonts";
export const metadata: Metadata = {
  title: "OffBeat - A music discovery platform",
  description: "Discover and enjoy music like never before with OffBeat.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html
        lang="en"
        className={`${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable} ${plexSerif.variable}`}
      >
        <body>
          <div className="@container mx-auto flex flex-col h-screen">
            <Toaster />
            <Header />
            <div className="flex flex-col md:flex-row grow overflow-y-scroll">
              <Sidebar />
              {children}
            </div>
            <footer className="border-t border-ob-border py-4">
              <p className="text-sm text-ob-dim">
                &copy; {new Date().getFullYear()} Saboteur. All rights reserved.
              </p>
            </footer>
          </div>
        </body>
        <GoogleAnalytics gaId="G-K7ZC9GL4CX" />
      </html>
    </StoreProvider>
  );
}
