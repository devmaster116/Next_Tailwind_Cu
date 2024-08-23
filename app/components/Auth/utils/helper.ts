import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase/config";

// export const validateEmail = (email: string): boolean => {
//   if (!email) return false;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

export const validateEmail = (email: string) => {
  return /^\S+@\S+\.\S+$/.test(email)
}

export const validateMobileNumber = (mobileNumber: string): boolean => {
  console.log("mobile number ===>", mobileNumber)
  if (!mobileNumber) return false
  // const mobileNumberRegex = /^04\d{8}$/;
  // return mobileNumberRegex.test(mobileNumber);
  if (/^\d{10}$/.test(mobileNumber))
    return true
  return false
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

export function removeGst<T extends Record<K, number>, K extends keyof T>(
  items: T[],
  priceKey: K
): T[] {
  return items.map(item => ({
    ...item,
    [priceKey]: parseFloat((item[priceKey] / 1.1).toFixed(2)),
  }));
}

export function formatUrlToTitle(urlPath: string): string {
  return urlPath
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

export const handleInputChangeField = (
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  fieldName: string
) => {
  const newValue: string = e.target.value;
  setState(prevState => ({ ...prevState, [fieldName]: newValue }));
  setError(prevState => ({ ...prevState, [fieldName]: "" }));
};

export const handleBlurField = (
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  validate: (value: string) => boolean,
  errorMessage: string,
  fieldName: string
) => {
  const { value } = e.target;
  if (!validate(value)) {
    setError(prevState => ({ ...prevState, [fieldName]: errorMessage }));
  } else {
    setState(prevState => ({ ...prevState, [fieldName]: value }));
    setError(prevState => ({ ...prevState, [fieldName]: "" }));
  }
};

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const timeZoneOffset = "+05:30";

  const parts = formattedDate.split(" ");

  if (parts.length < 5) {
    throw new Error("Unexpected date format");
  }

  const monthDayYear = `${parts[0]} ${parts[1]} ${parts[2]}`;
  const time = `${parts[4]} ${parts[5]}`;

  return `${monthDayYear} at ${time} UTC${timeZoneOffset}`;
};

export const generateRandomPassword = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};
