import React, { forwardRef } from "react";
import styles from "./input.module.scss";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type InputProps = {
  value?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlurField?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  loading?: boolean;
  placeholder?: string | undefined;
  maxLength?: number | undefined;
  type?: string | undefined;
  inputStyle?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      handleInputChange,
      handleBlurField,
      error,
      loading,
      placeholder,
      maxLength,
      type,
      inputStyle,
    },
    ref
  ) => {
    return (
      <div className={styles.inputContainer}>
        <input
          type={type ? type : "text"}
          id="name"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlurField}
          placeholder={placeholder}
          className={twMerge(
            styles.input,
            "border",
            error ? "!border-red-500" : "border-gray-300 focus:!border-sky-500",
            "focus:outline-none",
            inputStyle && inputStyle
          )}
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
  }
);
Input.displayName = "Input";

export default Input;
