"use client";
import React, { useState } from "react";
import styles from "./LoginDetails.module.scss";
import Link from "next/link";
import { auth, db } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { Oval } from "react-loader-spinner";
import {
  handleBlurEmail,
  handleInputChange,
  validateEmail,
} from "./Auth/utils/helper";
import { useUser } from "../context/UserContext";

const LoginDetails = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginMessage, setLoginMessage] = useState<string>("");
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userId: string = userCredential.user.uid as string;

        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          router.push("/reports-dashboard");
        } else {
          throw new Error("User document not found");
        }
      } catch (error) {
        setLoginMessage("Your password or email are incorrect. Try again.");
      } finally {
        setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
          {loading ? (
            <Oval
              height={27}
              width={31}
              color="#eaecf0"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#d0d5dd"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            "Sign in"
          )}
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
