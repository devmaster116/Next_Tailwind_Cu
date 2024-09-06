import "../../app/globals.css";
import "../../app/globals.scss";
import "react-modern-drawer/dist/index.css";
import "react-step-progress-bar/styles.css";
import SidebarMenuLayout from "../components/SidebarMenuLayout";
import { Urbanist } from "next/font/google";
import Navbar from "../components/Navbar";
import { UserProvider } from "../context/UserContext";
import { KitchenProvider } from "../context/KitchenContext";
import { ReportDateProvider } from "../context/ReportDateContext";
import { ReportDataProvider } from "../context/ReportDataContext";
import { FormStepProvider } from "../context/StaffFormStep";
import { FormProvider } from "../context/StaffContext";
import { BannerProvider } from "../context/BannerContext";

const urbanist = Urbanist({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReportDataProvider>
      <ReportDateProvider>
        <UserProvider>
          <KitchenProvider>
            <FormStepProvider>
              <FormProvider>
                <BannerProvider>
                  <html lang="en" className={urbanist.className}>
                    <body>
                      <Navbar />
                      <main className="main">
                        <SidebarMenuLayout>{children}</SidebarMenuLayout>
                      </main>
                      <footer className="footer">
                        © {new Date().getFullYear()} Swifti. All rights
                        reserved.
                      </footer>
                    </body>
                  </html>
                </BannerProvider>
              </FormProvider>
            </FormStepProvider>
          </KitchenProvider>
        </UserProvider>
      </ReportDateProvider>
    </ReportDataProvider>
  );
};

export default RootLayout;
