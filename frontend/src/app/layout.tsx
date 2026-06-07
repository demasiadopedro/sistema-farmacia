"Server Component";

import "./globals.css";
import { Open_Sans } from "next/font/google";
import {  cn  } from "@/lib/utils";

const openSans = Open_Sans({
  subsets:['latin'],
  variable:'--font-mono'
});
 

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
        "min-h-screen bg-background antialeased",
        openSans.className
      )        
      } >
        {children}
      </body>
    </html>
  );
}
