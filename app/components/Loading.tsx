import React from "react";
import Image from "next/image";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.shimmerBg}></div>
        <div className={styles.logo}>
          <Image
            src="/images/swifti-logo.png"
            height={40}
            width={66}
            alt="Swifti Logo"
          />
        </div>
      </div>
      <h3>Loading...</h3>
    </div>
  );
};

export default Loading;
