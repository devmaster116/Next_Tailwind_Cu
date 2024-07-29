"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "./utils/logout";
import styles from "./LogoutButton.module.scss";
import { useUser } from "../../context/UserContext";
import { useKitchen } from "../../context/KitchenContext";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const { setUser } = useUser();
  const { setKitchen } = useKitchen();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setKitchen(null);
    localStorage.removeItem("kitchenId");
    localStorage.removeItem("stripeCustomerId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("menuPageName");
    router.push("/business-login");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Log out
    </button>
  );
};

export default LogoutButton;
