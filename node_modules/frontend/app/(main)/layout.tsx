import Navbar from "@/components/main/Navbar";
import { ReduxProvider } from "@/store/Provider";
import Footer from "@/components/main/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-poppins text-bl`}>
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
