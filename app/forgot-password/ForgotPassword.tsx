"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ForgotPassword.module.scss";
import { resetPassword, validateEmail } from "../components/Auth/utils/helper";
import Link from "next/link";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setError("");
    setEmail(value);

    if (validateEmail(value)) {
      setError("");
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail: string = e.target.value;
    setEmail(newEmail);

    setError("");
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
      resetPassword(
        email,
        () => {
          const queryParams = new URLSearchParams({ email });
          router.push(`/email-sent?${queryParams.toString()}`);
        },
        () => {
          setError(
            `Sorry, the email ${email} was not found. Please try again.`
          );
        }
      );
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
                  className={styles.icon}
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
                onChange={handleInputChange}
                onBlur={handleBlurEmail}
                placeholder="Enter your email"
                className={`${styles.input} ${
                  error ? styles.invalidInput : ""
                }`}
              />
              {error && <label className={styles.errorLabel}>{error}</label>}
            </div>
          </div>
          <button className={styles.mainBtn} type="submit">
            Reset password
          </button>
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
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
