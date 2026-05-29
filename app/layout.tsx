// import { NavBar } from "@/components/4-organisms";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Roboto_Flex, Roboto_Mono } from "next/font/google";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["opsz", "wdth", "YTAS"],
  //  "GRAD" | "XOPQ" | "XTRA" | "YOPQ" | "YTAS" | "YTDE" | "YTFI" | "YTLC" | "YTUC" | "opsz" | "slnt" | "wdth"
  variable: "--font-roboto-flex",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Hojoon Kim",
  description: "Designer and software developer creating products, brands, and media across tech, film, and music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <body className={`${robotoFlex.variable} ${robotoMono.variable} antialiased relative min-h-screen`}>
        {/* <NavBar /> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
