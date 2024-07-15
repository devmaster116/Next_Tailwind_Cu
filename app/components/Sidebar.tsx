import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Image from "next/image";
import LogoutButton from "./Auth/LogoutButton";
import useWindowSize from "@/app/hooks/useWindowSize";

interface MenuItemProps {
  icon: React.ReactNode;
  name: string;
  route: string;
}

interface SidebarProps {
  show: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuPageName: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  show,
  setter,
  setMenuPageName,
}: SidebarProps) {
  const pathname = usePathname();

  const className = `${styles.sidebar} ${
    show ? styles.sidebarShow : styles.sidebarHide
  }`;

  const MenuItem = ({ icon, name, route }: MenuItemProps) => {
    const isActive = pathname === route;
    const colorClass = isActive ? styles.active : styles.inactive;

    return (
      <Link
        href={route}
        onClick={() => {
          setter(oldVal => !oldVal);
          setMenuPageName(name);
        }}
        className={`${styles.menuItem} ${colorClass}`}
      >
        <div className={styles.iconContainer}>{icon}</div>
        <div>{name}</div>
      </Link>
    );
  };

  const ModalOverlay = () => (
    <div
      className={styles.modalOverlay}
      onClick={() => {
        setter(oldVal => !oldVal);
      }}
    />
  );

  const { width } = useWindowSize();
  return (
    <>
      <div className={`${styles.sidebarContainer} ${className}`}>
        <div className={styles.menuItemsContainer}>
          <div className={styles.logoContainer}>
            {width && width <= 600 && (
              <Image
                src="/icons/swifti-2.svg"
                height={20}
                width={94}
                alt="Swifti Logo"
                className={styles.logo}
              />
            )}
            <h4>Reports</h4>
            <MenuItem
              name="Overview"
              route="/reports-dashboard"
              icon={
                <Image
                  className={styles.icon}
                  src="/icons/home-line.svg"
                  height={18}
                  width={18}
                  alt="Home line icon"
                />
              }
            />
            <MenuItem
              name="Sales Summary"
              route="/sales-summary"
              icon={
                <Image
                  className={styles.icon}
                  src="/icons/bar-chart-square-02.svg"
                  height={18}
                  width={18}
                  alt="Bar chart icon"
                />
              }
            />
          </div>
          <div className={styles.logoutBtn}>
            <LogoutButton />
          </div>
        </div>
        <div className={styles.sidebarFooter}>
          <div className={styles.businessLogo}>
            <Image
              src="/icons/swifti-2.svg"
              height={20}
              width={40}
              alt="Swifti Logo"
              className={styles.logo}
            />
          </div>
          <div className={styles.businessDetails}>
            <h4>Banh Mi Brother</h4>
            <p>ghassan.zakaria@gmail.com</p>
          </div>
        </div>
      </div>
      {show ? <ModalOverlay /> : null}
    </>
  );
}
