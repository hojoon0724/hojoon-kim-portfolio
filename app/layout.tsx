import "@/styles/globals.css";
import { Metadata } from "next";
import { Roboto_Flex, Roboto_Mono } from "next/font/google";
import { ScrollProvider } from "./ScrollProvider";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["GRAD", "opsz", "wdth", "YTAS", "XOPQ", "YOPQ"],
  //  axes: ["GRAD", "XOPQ", "XTRA", "YOPQ", "YTAS", "YTDE", "YTFI", "YTLC", "YTUC", "opsz", "slnt", "wdth"],
  variable: "--font-roboto-flex",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Hojoon Kim",
  description:
    "Designer and software developer creating products, brands, and media across tech, music, and film helping teams turn early ideas into shipped products.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Hojoon Kim",
    description:
      "Designer and software developer creating products, brands, and media across tech, music, and film helping teams turn early ideas into shipped products.",
    url: "https://hojoonkim.com",
    siteName: "Hojoon Kim",
    images: ["/hk-opengraph-image.png"],
    locale: "en-US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Hojoon Kim",
    description:
      "Designer and software developer creating products, brands, and media across tech, music, and film helping teams turn early ideas into shipped products.",
    images: ["/hk-opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <body
        className={`${robotoFlex.variable} ${robotoMono.variable} relative max-h-dvh antialiased transition-colors duration-500`}
      >
        <ScrollProvider>
          <main className="h-full min-h-dvh">{children}</main>
        </ScrollProvider>
        {/* <NavBar /> */}
      </body>
    </html>
  );
}
