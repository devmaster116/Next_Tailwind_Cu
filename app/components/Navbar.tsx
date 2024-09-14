"use client";

import Link from "next/link";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "./Auth/utils/logout";
import LightLoader from "./LightLoader";
import { useUser } from "../context/UserContext";
import { useKitchen } from "../context/KitchenContext";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const { user, setUser } = useUser();
  const { kitchen, setKitchen } = useKitchen();

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    setUser(null);
    setKitchen(null);
    localStorage.removeItem("kitchenId");
    localStorage.removeItem("stripeCustomerId");
    localStorage.removeItem("userEmail");
    router.push("/business-login");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current?.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      {loading && <LightLoader />}
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link className={styles.logoContainer} href="/">
            <Image
              src="/images/swifti-2.png"
              height={20}
              width={94}
              alt="Swifti Logo and text"
            />
          </Link>
        </div>
        <div className={styles.businessDetailsContainer}>
          <div className={styles.businessDetailsContent}>
            <h4>{kitchen?.kitchenName}</h4>
            <p>{user?.email}</p>
          </div>
          <div
            className={styles.userImageContainer}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <Image
              style={{ marginLeft: 0 }}
              src="/icons/user.png"
              height={18}
              width={16}
              alt="user"
            />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown} ref={dropdownRef}>
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <Image
                  style={{ marginLeft: 0 }}
                  src="/icons/logout.svg"
                  height={18}
                  width={16}
                  alt="user"
                />
                <span className={styles.dropdownText}>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
