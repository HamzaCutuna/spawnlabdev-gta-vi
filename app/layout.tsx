import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import "./explore.css";
import "./location-detail.css";
import "./people.css";
import "./release.css";
import "./archive.css";
import "./field-log.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leonida — SPAWNLABDEV Experiment 001",
  description: "An unofficial interactive companion to the world of Grand Theft Auto VI. A SPAWNLABDEV experiment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
