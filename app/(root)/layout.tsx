import "../../app/globals.scss";
import LogoutButton from "../components/Auth/LogoutButton";
import Image from "next/image";

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
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
