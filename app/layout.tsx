import type { Metadata } from "next";
import "./globals.css";

const base = "https://deanooooooooo.github.io/naw-bathrooms-premium-site";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "N.A.W. Bathrooms Leeds | Premium Bathroom Renovation Site",
  description:
    "Premium React concept for N.A.W. Bathrooms in Leeds: bathroom renovations, plumbing, tiling and free no-obligation quotes.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: base,
    title: "N.A.W. Bathrooms Leeds",
    description: "Premium bathroom renovation and plumbing site concept for N.A.W. Bathrooms in Leeds.",
    images: [`${base}/assets/van.jpg`],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
