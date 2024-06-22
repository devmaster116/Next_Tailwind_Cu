import "../../app/globals.css";
import type { Metadata } from "next";
import LogoutButton from "../components/Auth/LogoutButton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Customer admin webapp",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="layoutMain">
          <Image
            src="/swifti-logo.png"
            height={20}
            width={33}
            alt="Swifti Logo"
          />
          <h2>Swifti</h2>
          <LogoutButton />
        </main>
        {children}
      </body>
    </html>
  );
}
