import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvidor from "@/components/StoreProvidor";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notex",
  description: "Notex is a note taking app with imersive user experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <StoreProvidor>
        {children}
      </StoreProvidor>
      </body>
    </html>
  );
}
