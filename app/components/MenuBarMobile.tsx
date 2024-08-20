import React from "react";
import styles from "./MenuBarMobile.module.scss";
import Image from "next/image";

interface MenuBarMobileProps {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  pageTitle: string | undefined;
}
const MenuBarMobile: React.FC<MenuBarMobileProps> = ({ setter, pageTitle }) => {
  return (
    <nav className={styles.menuBarMobile}>
      <div className={styles.menuBarInnerContainer}>
        <button
          className={styles.menuButton}
          onClick={() => {
            setter(oldVal => !oldVal);
          }}
        >
          <Image
            className={styles.icon}
            src="/icons/menu-01.svg"
            height={12}
            width={18}
            alt="arrow left icon"
          />
        </button>
        <h2>{pageTitle}</h2>
      </div>
    </nav>
  );
};

export default MenuBarMobile;
