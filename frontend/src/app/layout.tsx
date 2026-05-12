"Server Component";

import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import {  cn  } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`antialiased`}
    >
      <body className={cn(
        "min-h-screen bg-background font-poppins antialeased"
      )        
      }>
        {children}
      </body>
    </html>
  );
}
