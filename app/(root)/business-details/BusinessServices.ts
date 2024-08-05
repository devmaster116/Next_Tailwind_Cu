import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  DocumentData,
  Query,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { db, auth } from "@/firebase/config";
import { Kitchen, User } from "@/app/src/types";
import { generateRandomPassword } from "@/app/components/Auth/utils/helper";
import { FirebaseError } from "firebase/app";

export const getBusinessDetailsAPI = async (
  kitchenId: string
): Promise<Kitchen | null> => {
  try {
    const getBusinessData = doc(db, "kitchens", kitchenId);
    const configDocSnap = await getDoc(getBusinessData);

    if (configDocSnap.exists()) {
      const data = configDocSnap.data() as Kitchen;
      return data;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error("Error fetching business details:", err);
    return null;
  }
};

export const getOwnerAPI = async (
  kitchenId: string
): Promise<User[] | null> => {
  try {
    const usersCollection = collection(db, "users");
    const ownerQuery = query(
      usersCollection,
      where("owner", "==", true),
      where("kitchenId", "==", kitchenId)
    );
    const querySnapshot = await getDocs(ownerQuery);

    if (querySnapshot.empty) {
      console.log("No users with owner flag set to true.");
      return null;
    }

    const ownerDetails: User[] = querySnapshot.docs.map((doc) => {
      const {
        email,
        userType,
        secondaryContact,
        createdAt,
        displayName,
        kitchenId,
        setupComplete,
        owner,
        mobileNumber,
        isTransferOwnershipReview,
      } = doc.data() as User;

      return {
        uid: doc.id,
        email: email,
        userType: userType,
        secondaryContact: secondaryContact,
        createdAt: createdAt,
        displayName: displayName,
        kitchenId: kitchenId,
        setupComplete: setupComplete,
        owner: owner,
        mobileNumber: mobileNumber,
        isTransferOwnershipReview: isTransferOwnershipReview,
      };
    });
    return ownerDetails;
  } catch (err) {
    console.error("Error fetching owner data:", err);
    return null;
  }
};

export const getUserDetailsAPI = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    if (querySnapshot.empty) {
      console.log("No users found.");
      return [];
    }

    const userData: User[] = querySnapshot.docs.map((doc) => {
      const {
        email,
        userType,
        secondaryContact,
        createdAt,
        displayName,
        kitchenId,
        setupComplete,
        owner,
        mobileNumber,
        isTransferOwnershipReview,
      } = doc.data() as User;

      return {
        uid: doc.id,
        email: email,
        userType: userType,
        secondaryContact: secondaryContact,
        createdAt: createdAt,
        displayName: displayName,
        kitchenId: kitchenId,
        setupComplete: setupComplete,
        owner: owner,
        mobileNumber: mobileNumber,
        isTransferOwnershipReview: isTransferOwnershipReview,
      };
    });

    return userData;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return [];
  }
};

export const getSecondaryContactDataAPI = async (
  query: Query<DocumentData>
): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(query);

    if (querySnapshot.empty) {
      console.log("No users found for the given query.");
      return [];
    }
    const data: User[] = querySnapshot.docs.map((doc) => {
      const {
        email,
        userType,
        secondaryContact,
        createdAt,
        displayName,
        kitchenId,
        setupComplete,
        owner,
        mobileNumber,
        isTransferOwnershipReview,
      } = doc.data() as User;

      return {
        uid: doc.id,
        email: email,
        userType: userType,
        secondaryContact: secondaryContact,
        createdAt: createdAt,
        displayName: displayName,
        kitchenId: kitchenId,
        setupComplete: setupComplete,
        owner: owner,
        mobileNumber: mobileNumber,
        isTransferOwnershipReview: isTransferOwnershipReview,
      };
    });

    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
};

export const addUserAPI = async (
  newUser: Omit<User, "uid" | "createdAt">
): Promise<void> => {
  const password = generateRandomPassword();
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", newUser.email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      console.log("User already exists with this email.");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user)
      .then(() => {
        console.log("Verification email sent");
      })
      .catch((err) => {
        console.error(
          "Error creating user or sending verification email:",
          err
        );
      });

    await updateProfile(user, { displayName: newUser.displayName });

    const userDocData = {
      ...newUser,
      createdAt: new Date(),
    };

    const userDocRef = doc(usersCollection, user.uid);
    await setDoc(userDocRef, userDocData);
  } catch (err) {
    console.error("Error adding user data:", err);
    throw err;
  }
};

export const deleteUserAPI = async (email: string): Promise<void> => {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.log("No user found with this email.");
      return;
    }

    for (const docSnapshot of querySnapshot.docs) {
      const docId = docSnapshot.id;
      const docRef = doc(db, "users", docId);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.error("Error deleting user data:", err);
    throw err;
  }
};

const validateStringParameter = (param: string, paramName: string): void => {
  if (!param || typeof param !== "string" || param.trim() === "") {
    throw new Error(`${paramName} must be a non-empty string.`);
  }
};

const validateUpdateData = (data: Partial<DocumentData>): void => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error(`updateData must be a non-empty object.`);
  }
};

export const sendEmailVerificationAPI = async (
  currentUser: FirebaseUser
) => {
  await sendEmailVerification(currentUser).then(() => {
    console.log("Verification email sent");
    return;
  });
};

export const updateAuthenticationEmailAPI = async (
  currentUser: FirebaseUser,
  newEmail: string
) => {
  return updateEmail(currentUser, newEmail)
    .then(() => {
      console.log("Email updated successfully");
      sendEmailVerification(currentUser).then(() => {
        console.log("Verification email sent");
        return;
      });
    })
    .catch((err) => {
      console.error("Error updating email:", err);
      throw err;
    });
};

export const updateDataAPI = async (
  collectionName: string,
  docId: string,
  updateData: Partial<DocumentData>
): Promise<void> => {
  try {
    validateStringParameter(collectionName, "collectionName");
    validateStringParameter(docId, "docId");
    validateUpdateData(updateData);
    if (!docId) {
      throw new Error("Document ID is required.");
    }
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateData);
  } catch (err) {
    console.error(`Error updating document in ${collectionName}:`, err);
    throw err;
  }
};

export const checkUserExistsByEmail = async (
  email: string
): Promise<boolean> => {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    return !querySnapshot.empty;
  } catch (err) {
    console.error("Error checking user existence by email:", err);
    throw err;
  }
};
