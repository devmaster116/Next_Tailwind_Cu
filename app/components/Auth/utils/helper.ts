import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../environments/staging/firebaseConfig";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
