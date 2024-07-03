"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ForgotPassword.module.scss";
import { validateEmail } from "../components/Auth/utils/helper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/environments/staging/firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);

    if (validateEmail(value)) {
      setError("");
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;

    const emailValue = email.trim();
    if (!validateEmail(emailValue)) {
      setError("Please enter a valid email address.");
      valid = false;
    } else {
      setError("");
    }

    if (valid) {
      e.preventDefault();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("Sent successfully");
        })
        .catch(error => {
          console.log("Error:", error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.information}>
          <div className={styles.svgContainer}>
            <div className={styles.outerCircle}>
              <div className={styles.innerCircle}>
                <Image
                  className={styles.keyIcon}
                  src="/icons/key.svg"
                  height={21}
                  width={21}
                  alt="key icon"
                />
              </div>
            </div>
          </div>

          <h2>Forgot password?</h2>
          <p>
            No worries, enter the email associated with your account to change
            your password.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={styles.inputLabel} htmlFor="email">
              Email
            </label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleBlurEmail}
                placeholder="Enter your email"
                className={`${styles.input} ${
                  error ? styles.invalidInput : ""
                }`}
              />
              {error && <label className={styles.errorLabel}>{error}</label>}
            </div>
          </div>
          <button className={styles.resetPasswordBtn} type="submit">
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
