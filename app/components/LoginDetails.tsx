"use client";
import React, { useState } from "react";
import styles from "./LoginDetails.module.scss";
import Link from "next/link";
import { auth, db } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {
  handleBlurEmail,
  handleInputChange,
  validateEmail,
} from "./Auth/utils/helper";

const LoginDetails = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginMessage, setLoginMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userId = userCredential.user.uid;
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const kitchenId = userDocSnap.data().kitchenId;
          const userEmail = userDocSnap.data().email;
          const docRef = doc(db, "kitchens", kitchenId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const kitchenName = docSnap.data().kitchenName;
            localStorage.setItem("kitchenName", kitchenName);
          }

          localStorage.setItem("kitchenId", kitchenId);
          localStorage.setItem("userEmail", userEmail);
          router.push("/reports-dashboard");
        } else {
          throw new Error("User document not found");
        }
      } catch (error) {
        setLoginMessage("Your password or email are incorrect. Try again.");
      }
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
    setLoginMessage("");
  };

  return (
    <div className={styles.main}>
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
              onChange={e => handleInputChange(e, setEmail, setError)}
              onBlur={e => handleBlurEmail(e, setEmail, setError)}
              placeholder="Enter your email"
              className={`${styles.input} ${error ? styles.invalidInput : ""}`}
            />
            {error && <label className={styles.errorLabel}>{error}</label>}
          </div>
        </div>
        <div>
          <label className={styles.inputLabel} htmlFor="password">
            Password
          </label>
          <div className={styles.inputContainer}>
            <input
              type="password"
              onChange={handleChangePassword}
              placeholder="Enter password"
              className={`${styles.input} ${
                passwordError || loginMessage ? styles.invalidInput : ""
              }`}
            />
            {!password && (
              <label className={styles.errorLabel}>{passwordError}</label>
            )}
            {loginMessage && (
              <label className={styles.errorLabel}>{loginMessage}</label>
            )}
          </div>
        </div>
        <Link href="/forgot-password" className={styles.forgotPasswordLink}>
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
