"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "../forgot-password/ForgotPassword.module.scss";
import Link from "next/link";
import { resetPassword } from "../components/Auth/utils/helper";

const EmailSent = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const [_, setError] = useState<string>("");

  const handleResendEmail = () => {
    resetPassword(
      userEmail || "",
      () => {
        console.log("Email sent");
      },
      errorMessage => {
        setError(errorMessage);
      }
    );
  };

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
        <div className={styles.resendEmail}>
          <p>Didn't receive the email?</p>
          <button onClick={handleResendEmail}>Click to resend</button>
        </div>
        <div className={styles.backToLogin}>
          <Image
            className={styles.icon}
            src="/icons/arrow-left.svg"
            height={12}
            width={12}
            alt="arrow left icon"
          />
          <Link href="/business-login" className={styles.link}>
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
