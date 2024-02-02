import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/contexts/SocketContext";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat with Me!",
  description: "Chat in real-time!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${rubik.className} bg-black text-white`}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
