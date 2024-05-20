"use client";
import React, { useState } from "react";
import styles from "./LoginDetails.module.scss";
import Link from "next/link";

const LoginDetails = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  return (
    <div className={styles.main}>
      <form>
        <div>
          <label htmlFor="username">Email</label>
          <div className={styles.inputContainer}>
            <input
              value={email}
              placeholder="Enter your email"
              onChange={ev => setEmail(ev.target.value)}
              className={styles.emailInput}
            />
          </div>

          <label>{emailError}</label>
        </div>
        <div>
          <label htmlFor="username">Password</label>
          <div className={styles.inputContainer}>
            <input
              value={password}
              placeholder="Enter password"
              onChange={ev => setPassword(ev.target.value)}
              className={styles.emailInput}
            />
          </div>
          <label>{passwordError}</label>
        </div>
        <button className={styles.forgotPasswordBtn} type="button">
          Forgot Password?
        </button>
        <button className={styles.signInBtn} type="button">
          Sign in
        </button>
        <div className={styles.signUpContainer}>
          <p>Don't have an account?</p>
          <Link href="/signup">Get started now</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginDetails;
