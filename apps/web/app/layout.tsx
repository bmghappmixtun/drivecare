import type { Metadata } from "next";
import { APP_CONFIG } from "@drivecare/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.appName,
  description: "Gestion moderne d'entretien automobile",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
