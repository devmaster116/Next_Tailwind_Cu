"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LoginDetails from "../components/LoginDetails";
import styles from "./LoginPage.module.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/environments/staging/firebaseConfig";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedKitchenId = localStorage.getItem("kitchenId");
    onAuthStateChanged(auth, user => {
      if (user) {
        router.push(`/reports-dashboard?kitchenId=${storedKitchenId}`);
      } else {
        setLoading(false);
      }
    });
  }, [loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginElements}>
        <div className={styles.staticLoginDetails}>
          <Image
            className={styles.swiftiLogo}
            src="/images/swifti-logo.png"
            height={37}
            width={48}
            alt="Swifti Logo"
          />
          <h2>Login</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>
        <LoginDetails />
      </div>
    </div>
  );
};

export default LoginPage;
