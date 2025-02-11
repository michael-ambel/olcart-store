import type { Metadata } from "next";

import "./globals.css"; // Global CSS containing the font-face definitions
import { ReduxProvider } from "@/store/Provider";
import Initalizer from "@/components/Initalizer";
import ToastNotifications from "@/components/ToastNotifications";

export const metadata: Metadata = {
  title: "OlCart",
  description: "Modern eCommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased text-bl bg-bg">
        <ReduxProvider>
          <Initalizer />
          <ToastNotifications />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
