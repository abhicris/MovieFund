import type { Metadata } from "next";
import "./globals.css";
import AlphaBanner from "@/components/AlphaBanner";

export const metadata: Metadata = {
  title: "MovieFund - Fractional Movie Investment Platform",
  description: "Invest in films and earn returns from box office, streaming, and distribution revenue. Fractional ownership in movies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AlphaBanner />
        {children}
      </body>
    </html>
  );
}
