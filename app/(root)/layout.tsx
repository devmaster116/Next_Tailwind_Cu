import "../../app/globals.scss";
import LogoutButton from "../components/Auth/LogoutButton";
import Image from "next/image";
import SidebarMenuLayout from "../components/SidebarMenuLayout";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <main className="layoutMain">
          <Image
            src="/images/swifti-logo.png"
            height={20}
            width={33}
            alt="Swifti Logo"
          />
          <h2>Swifti</h2>
          <LogoutButton />
        </main>
        <SidebarMenuLayout>{children}</SidebarMenuLayout>
      </body>
    </html>
  );
};

export default RootLayout;
