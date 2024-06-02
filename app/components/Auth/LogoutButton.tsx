"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "./utils/logout";
import styles from "./LogoutButton.module.scss";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/business-login");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  );
};

export default LogoutButton;
