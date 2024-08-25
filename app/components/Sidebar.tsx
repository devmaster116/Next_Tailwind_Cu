import React from "react";
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
}

export default function Sidebar({ show, setter }: SidebarProps) {
  const pathname = usePathname();

  const { user } = useUser();
  const { kitchen } = useKitchen();

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
      <div className={`${styles.sidebarContainer} ${className}`}>
        <div className={styles.innerContainer}>
          <div className={styles.logoContainer}>
            <h4>Reports</h4>
            <div className={styles.menuItems}>
              <MenuItem
                name="Overview"
                route="/overview"
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
                    src="/icons/line-chart-up-01.svg"
                    height={18}
                    width={18}
                    alt="Line chart icon"
                  />
                }
              />
              <MenuItem
                name="Category Sales"
                route="/category-sales"
                icon={
                  <Image
                    className={styles.icon}
                    src="/icons/bar-chart-square-03.svg"
                    height={18}
                    width={18}
                    alt="Bar chart square icon"
                  />
                }
              />
              <MenuItem
                name="Item Sales"
                route="/item-sales"
                icon={
                  <Image
                    className={styles.icon}
                    src="/icons/bar-chart-circle-01.svg"
                    height={18}
                    width={18}
                    alt="Bar chart circle icon"
                  />
                }
              />
              <MenuItem
                name="Sales Trends"
                route="/sales-trends"
                icon={
                  <Image
                    className={styles.icon}
                    src="/icons/line-chart-up-01.svg"
                    height={18}
                    width={18}
                    alt="Line chart icon"
                  />
                }
              />
            </div>
          </div>
          {kitchen?.accessManagementEnabled && (
            <div className={styles.logoContainer}>
              <h4>POS Access Management</h4>
              <div className={styles.menuItems}>
                <MenuItem
                  name="Permissions"
                  route="/permissions"
                  icon={
                    <Image
                      className={styles.icon}
                      src="/icons/permissions.svg"
                      height={18}
                      width={18}
                      alt="Business Details icon"
                    />
                  }
                />
              </div>
            </div>
          )}

          <div className={styles.logoContainer}>
            <h4>Account and Billing</h4>
            <div className={styles.menuItems}>
              <MenuItem
                name="Business Details"
                route="/business-details"
                icon={
                  <Image
                    className={styles.icon}
                    src="/icons/business-details.svg"
                    height={18}
                    width={18}
                    alt="Business Details icon"
                  />
                }
              />
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
