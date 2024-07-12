import React from "react";
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
}

export default function Sidebar({ show, setter }: SidebarProps) {
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
          <Link href="/">
            <Image
              src="/images/swifti-logo.png"
              height={100}
              width={160}
              alt="Swifti Logo"
            />
          </Link>
        </div>
        <div className="flex flex-col">
          <MenuItem
            name="Home"
            route="/"
            icon={
              <Image
                className={styles.icon}
                src="/icons/arrow-left.svg"
                height={12}
                width={12}
                alt="arrow left icon"
              />
            }
          />
          <MenuItem
            name="T-Shirts"
            route="/t-shirts"
            icon={
              <Image
                className={styles.icon}
                src="/icons/calendar.svg"
                height={12}
                width={12}
                alt="arrow left icon"
              />
            }
          />
          <MenuItem
            name="Hats"
            route="/hats"
            icon={
              <Image
                className={styles.icon}
                src="/icons/key.svg"
                height={12}
                width={12}
                alt="arrow left icon"
              />
            }
          />
          <MenuItem
            name="About Us"
            route="/about"
            icon={
              <Image
                className={styles.icon}
                src="/icons/exclamation.svg"
                height={12}
                width={12}
                alt="arrow left icon"
              />
            }
          />
          <MenuItem
            name="Contact"
            route="/contact"
            icon={
              <Image
                className={styles.icon}
                src="/icons/calendar.svg"
                height={12}
                width={12}
                alt="arrow left icon"
              />
            }
          />
        </div>
      </div>
      {show ? <ModalOverlay /> : null}
    </>
  );
}
