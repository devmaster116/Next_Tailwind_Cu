"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "../forgot-password/ForgotPassword.module.scss";

const EmailSent = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.information}>
          <div className={styles.svgContainer}>
            <div className={styles.outerCircle}>
              <div className={styles.innerCircle}>
                <Image
                  className={styles.icon}
                  src="/icons/envelope.svg"
                  height={21}
                  width={21}
                  alt="envelope icon"
                />
              </div>
            </div>
          </div>

          <h2>Check your email</h2>
          <p>
            We sent a password reset link to <span>{userEmail}</span>
          </p>
        </div>
        <button className={styles.mainBtn} type="submit">
          Open email app
        </button>
      </div>
    </div>
  );
};

export default EmailSent;
