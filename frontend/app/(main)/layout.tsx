"use client"; // Make this a client component

import { usePathname } from "next/navigation";
import Navbar from "@/components/main/Navbar";
import { ReduxProvider } from "@/store/Provider";
import Footer from "@/components/main/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`antialiased font-poppins text-bl`}>
        <ReduxProvider>
          <Navbar />
          {children}
          {!pathname?.includes("/search") && <Footer />}
        </ReduxProvider>
      </body>
    </html>
  );
}
