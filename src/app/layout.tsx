import "./globals.css";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientShell from "@/components/ClientShell";
import OpeningLoader from "@/components/OpeningLoader";

const bodyFont = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "PaulTech Store | iPhones, Samsung, Pixel & iPads",
  description: "Shop smartphones and tablets from PaulTech Store."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ClientShell>
          <OpeningLoader>
            <Header />
            <main>{children}</main>
            <Footer />
          </OpeningLoader>
        </ClientShell>
      </body>
    </html>
  );
}
