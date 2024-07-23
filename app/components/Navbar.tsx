"use client";

import Link from "next/link";
import styles from "./Navbar.module.scss"; // Import the SCSS file for styling
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "./Auth/utils/logout";
import LightLoader from "./LightLoader";

const Navbar = () => {
  const [kitchenName, setKitchenName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false)

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setLoading(true)
    await logout();
    setLoading(false)
    localStorage.removeItem("kitchenId");
    localStorage.removeItem("stripeCustomerId");
    localStorage.removeItem("userEmail");
    router.push("/business-login");
  };


  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current?.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setKitchenName(localStorage.getItem("kitchenName"));
      setUserEmail(localStorage.getItem("userEmail"));
    }
  }, []);

  useEffect(() => {
    // Add event listener for clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
        {loading && <LightLoader />}
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link className={styles.logoContainer} href="/">
            <Image
              src="/images/swifti-logo.png"
              height={20}
              width={33}
              alt="Swifti Logo"
            />

            <h2>Swifti</h2>
          </Link>
        </div>
        <div className={styles.businessDetailsContainer}>
          <div className={styles.businessDetailsContent}>
            <h4>{kitchenName}</h4>
            <p>{userEmail}</p>
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
                <span className={styles.dropdownText}>

                Logout
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
