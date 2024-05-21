"use client";
import React, { useState } from "react";
import styles from "./LoginDetails.module.scss";
import Link from "next/link";

const LoginDetails = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlurEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);

    if (validateEmail(value)) {
      setError("");
    } else {
      setError("Please enter a valid email address.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;

    if (!password) {
      setPasswordError("Please enter a password.");
      valid = false;
    } else {
      setPasswordError("");
    }

    const emailValue = email.trim();
    if (!validateEmail(emailValue)) {
      setError("Please enter a valid email address.");
      valid = false;
    } else {
      setError("");
    }

    if (valid) {
      alert("Form submitted successfully!");
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={styles.inputLabel} htmlFor="username">
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
              className={`${styles.input} ${error ? styles.invalidInput : ""}`}
            />
            {error && <label className={styles.errorLabel}>{error}</label>}
          </div>
        </div>
        <div>
          <label className={styles.inputLabel} htmlFor="username">
            Password
          </label>
          <div className={styles.inputContainer}>
            <input
              type="password"
              onChange={handleChangePassword}
              placeholder="Enter password"
              className={`${styles.input} ${
                passwordError ? styles.invalidInput : ""
              }`}
            />
            {!password && (
              <label className={styles.errorLabel}>{passwordError}</label>
            )}
          </div>
        </div>
        <Link href="/forgotpassword" className={styles.forgotPasswordLink}>
          Forgot Password?
        </Link>
        <button className={styles.signInBtn} type="submit">
          Sign in
        </button>
        <div className={styles.signUpContainer}>
          <p>Don't have an account?</p>
          <Link href="https://swifti.com.au/get-started/">Get started now</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginDetails;
