import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Image from "next/image";
import LogoutButton from "./Auth/LogoutButton";
import { useUser } from "../context/UserContext";
import { useKitchen } from "../context/KitchenContext";

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

  const { user, setUser } = useUser();
  const { kitchen, setKitchen } = useKitchen();

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

  return (
    <>
      <div className={`${styles.sidebarContainer} ${className}`}>
        <div className={styles.innerContainer}>
          <div className={styles.logoContainer}>
            <h4>Reports</h4>
            <div className={styles.menuItems}>
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
          </div>

          <div className={styles.logoContainer}>
            <h4>Account and Billing</h4>
            <div className={styles.menuItems}>
              <MenuItem
                name="Subscriptions"
                route="/subscriptions"
                icon={
                  <Image
                    className={styles.icon}
                    src="/icons/card.svg"
                    height={18}
                    width={18}
                    alt="Subscriptions icon"
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.logoutBtn}>
            <LogoutButton />
          </div>
        <div className={styles.sidebarFooter}>
          <div className={styles.businessLogo}>
            <Image
              src="/images/swifti-logo.png"
              height={18}
              width={28}
              alt="Swifti Logo"
              className={styles.logo}
            />
          </div>
          <div className={styles.businessDetails}>
            <h4>{kitchen?.kitchenName}</h4>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
      {show ? <ModalOverlay /> : null}
    </>
  );
}
