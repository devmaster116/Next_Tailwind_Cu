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
  // Concatenate page title (if exists) to site title
  let titleConcat = "Responsive Sidebar Example";
  if (pageTitle) titleConcat = `${pageTitle} | ${titleConcat}`;

  // Mobile sidebar visibility state
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Head>
        <title>{titleConcat}</title>
      </Head>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <MenuBarMobile setter={setShowSidebar} />
          <Sidebar show={showSidebar} setter={setShowSidebar} />
          <div className={styles.contentArea}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenuLayout;
