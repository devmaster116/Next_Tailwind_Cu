import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase/config";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const handleBlurEmail = (
  e: React.ChangeEvent<HTMLInputElement>,
  setEmail: (email: string) => void,
  setError: (error: string) => void
) => {
  const { value } = e.target;
  setError("");
  setEmail(value);

  if (validateEmail(value)) {
    setError("");
  } else {
    setError("Please enter a valid email address.");
  }
};

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setEmail: (email: string) => void,
  setError: (error: string) => void
) => {
  const newEmail: string = e.target.value;
  setEmail(newEmail);
  setError("");
};

export const resetPassword = async (
  email: string,
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  try {
    await sendPasswordResetEmail(auth, email);
    onSuccess();
  } catch (error: any) {
    onError(error);
    console.log("Error:", error);
  }
};
