"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import MenuBarMobile from "./MenuBarMobile";
import styles from "./SidebarMenuLayout.module.scss";
import { usePathname } from "next/navigation";
import { formatUrlToTitle } from "./Auth/utils/helper";

interface SidebarMenuLayoutProps {
  pageTitle?: string;
  children: ReactNode;
}

const SidebarMenuLayout: React.FC<SidebarMenuLayoutProps> = ({
  pageTitle,
  children,
}) => {
  let titleConcat = "Responsive Sidebar Example";
  if (pageTitle) titleConcat = `${pageTitle} | ${titleConcat}`;

  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const pathnameToPageTitle = formatUrlToTitle(pathname);

  return (
    <>
      <Head>
        <title>{titleConcat}</title>
      </Head>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <MenuBarMobile
            setter={setShowSidebar}
            pageTitle={pathnameToPageTitle}
          />
          <Sidebar show={showSidebar} setter={setShowSidebar} />
          <div className={styles.contentArea}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenuLayout;
