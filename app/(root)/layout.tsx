import "../../app/globals.scss";
import SidebarMenuLayout from "../components/SidebarMenuLayout";
import { Urbanist } from "next/font/google";
import Navbar from "../components/Navbar";
import { UserProvider } from "../context/UserContext";
import { KitchenProvider } from "../context/KitchenContext";
import { ReportDateProvider } from "../context/ReportDateContext";

const urbanist = Urbanist({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReportDateProvider>
      <UserProvider>
        <KitchenProvider>
          <html lang="en" className={urbanist.className}>
            <body>
              <Navbar />
              <main className="main">
                <SidebarMenuLayout>{children}</SidebarMenuLayout>
              </main>
              <footer className="footer">
                © {new Date().getFullYear()} Swifti. All rights reserved.
              </footer>
            </body>
          </html>
        </KitchenProvider>
      </UserProvider>
    </ReportDateProvider>
  );
};

export default RootLayout;
