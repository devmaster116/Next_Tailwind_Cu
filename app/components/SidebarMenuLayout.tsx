"use client";
import React, { useState, ReactNode } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import MenuBarMobile from "./MenuBarMobile";
import styles from "./SidebarMenuLayout.module.scss";

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
  const [menuPageName, setMenuPageName] = useState("Overview");

  return (
    <>
      <Head>
        <title>{titleConcat}</title>
      </Head>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <MenuBarMobile setter={setShowSidebar} pageTitle={menuPageName} />
          <Sidebar
            show={showSidebar}
            setter={setShowSidebar}
            setMenuPageName={setMenuPageName}
          />
          <div className={styles.contentArea}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenuLayout;
