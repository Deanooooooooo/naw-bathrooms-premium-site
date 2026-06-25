import type { Metadata } from "next";
import "./globals.css";

const base = "https://deanooooooooo.github.io/naw-bathrooms-premium-site";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "N.A.W. Bathrooms Leeds | Bathroom Renovations",
  description:
    "Bathroom renovations, plumbing and tiling in Leeds from N.A.W. Bathrooms. Call or email for a free no-obligation quote.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: base,
    title: "N.A.W. Bathrooms Leeds | Bathroom Renovations",
    description: "Bathroom renovations, plumbing and tiling in Leeds from N.A.W. Bathrooms.",
    images: [`${base}/assets/finished-bathroom.jpg`],
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
