import React from "react";
import Image from "next/image";
import LoginDetails from "../components/LoginDetails";
import styles from "./LoginPage.module.scss";

const LoginPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginElements}>
        <div className={styles.staticLoginDetails}>
          <Image
            className={styles.swiftiLogo}
            src="/swifti-logo.png" // Route of the image file
            height={37} // Desired size with correct aspect ratio
            width={48} // Desired size with correct aspect ratio
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
