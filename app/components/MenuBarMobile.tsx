import React from "react";
import Link from "next/link";
import styles from "./MenuBarMobile.module.scss";
import Image from "next/image";

interface MenuBarMobileProps {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBarMobile: React.FC<MenuBarMobileProps> = ({ setter }) => {
  return (
    <nav className={styles.menuBarMobile}>
      <button
        className={styles.menuButton}
        onClick={() => {
          setter(oldVal => !oldVal);
        }}
      >
        <Image
          className={styles.icon}
          src="/icons/calendar.svg"
          height={12}
          width={12}
          alt="arrow left icon"
        />
      </button>
      <Link href="/" className={styles.logoLink}>
        {/*eslint-disable-next-line*/}
        <Image
          src="/images/swifti-logo.png"
          height={30}
          width={49}
          alt="Swifti Logo"
        />
      </Link>
      <Link className={styles.userLink} href="/login">
        <Image
          className={styles.icon}
          src="/icons/key.svg"
          height={12}
          width={12}
          alt="arrow left icon"
        />
      </Link>
    </nav>
  );
};

export default MenuBarMobile;
