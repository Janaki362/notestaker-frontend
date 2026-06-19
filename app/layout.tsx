import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NotesTaker AI | Enterprise Study Workspace",
  description: "Transform chaotic source material into structured knowledge with NotesTaker AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}