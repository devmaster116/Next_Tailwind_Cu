import "../../app/globals.scss";
import LogoutButton from "../components/Auth/LogoutButton";
import Image from "next/image";
import SidebarMenuLayout from "../components/SidebarMenuLayout";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <Image
            src="/images/swifti-logo.png"
            height={20}
            width={33}
            alt="Swifti Logo"
          />
          <h2>Swifti</h2>
          <LogoutButton />
        </header>
        <main className="main">
          <SidebarMenuLayout>{children}</SidebarMenuLayout>
        </main>
        <footer className="footer">
          © {new Date().getFullYear()} Swifti. All rights reserved.
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
