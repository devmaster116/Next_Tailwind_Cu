import React, { forwardRef } from "react";
import styles from "./input.module.scss";
import Image from "next/image";

type InputProps = {
  value?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlurField?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  loading?: boolean;
  placeholder?: string | undefined;
  maxLength?: number | undefined;
  type?: string | undefined;
};

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
  value,
  handleInputChange,
  handleBlurField,
  error,
  loading,
  placeholder,
  maxLength,
  type,
},ref) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type={type ? type : "text"}
        id="name"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlurField}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.invalidInput : ""}`}
        disabled={loading}
        maxLength={maxLength}
        ref={ref}
      />
      {error && (
        <div className={styles.inputErrorIcon}>
          <Image
            className={styles.icon}
            src="/icons/error.svg"
            height={16}
            width={16}
            alt="Business Details icon"
          />
        </div>
      )}
      {error && <p className={styles.errorLabel}>{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export default Input;
