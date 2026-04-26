import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import StoreProvider from "./StoreProvider";
import AppChrome from "./AppChrome";
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
            <AppChrome>{children}</AppChrome>
          </div>
        </body>
        <GoogleAnalytics gaId="G-K7ZC9GL4CX" />
      </html>
    </StoreProvider>
  );
}
