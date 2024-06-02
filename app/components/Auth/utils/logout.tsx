import { signOut } from "firebase/auth";
import { auth } from "../../../../environments/staging/firebaseConfig";

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
