"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LoginDetails from "../components/LoginDetails";
import styles from "./LoginPage.module.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        router.push(`/overview`);
      } else {
        setLoading(false);
      }
    });
  }, [loading, router]);

  if (loading) {
    return <Loading />;
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
