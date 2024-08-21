"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import MenuBarMobile from "./MenuBarMobile";
import styles from "./SidebarMenuLayout.module.scss";
import { BannerProvider } from "../context/BannerContext";

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
  const [menuPageName, setMenuPageName] = useState("");

  useEffect(() => {
    const storedMenuPageName = localStorage.getItem("menuPageName");
    if (storedMenuPageName) {
      setMenuPageName(storedMenuPageName);
    } else {
      setMenuPageName("Overview");
    }
  }, []);

  useEffect(() => {
    if (menuPageName) {
      localStorage.setItem("menuPageName", menuPageName);
    }
  }, [menuPageName]);

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
          {/* <BannerProvider> */}
            <div className={styles.contentArea}>{children}</div>
          {/* </BannerProvider> */}
        </div>
      </div>
    </>
  );
};

export default SidebarMenuLayout;
