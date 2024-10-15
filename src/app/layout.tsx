import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import MatrixBackground from "~/components/bg";


export const metadata: Metadata = {
  title: "CodeOne",
  description: "Compile all code in one txt format to feed any llm.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <MatrixBackground />
      <body>{children}</body>
    </html>
  );
}
