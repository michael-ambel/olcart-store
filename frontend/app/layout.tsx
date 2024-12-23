import type { Metadata } from "next";
import { Poetsen_One, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReduxProvider } from "@/store/Provider";
import Footer from "@/components/Footer";

const poetsOne = Poetsen_One({
  variable: "--font-poetsen-one",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
      <body
        className={`${poetsOne.variable} ${poppins.variable} antialiased font-poppins text-bl`}
      >
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
