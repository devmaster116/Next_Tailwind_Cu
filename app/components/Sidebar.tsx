import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Image from "next/image";

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

  return (
    <>
      <div className={className}>
        <div className={styles.logoContainer}>
          <h4>Reports</h4>
        </div>
        <div>
          {/* <MenuItem
            name="Home"
            route="/"
            icon={
              <Image
                className={styles.icon}
                src="/icons/arrow-left.svg"
                height={18}
                width={18}
                alt="arrow left icon"
              />
            }
          /> */}
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
      {show ? <ModalOverlay /> : null}
    </>
  );
}
