import { Configs, Kitchen, OnlineOrderConfig } from "@/app/src/types";
import { db } from "@/firebase/config";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

export const updatePosConfigInFirebase = async (
  updatedConfig: Configs, // Should be named `updatedConfig` to reflect it's for configuration
  kitchenId: string
) => {
  try {
    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      return;
    }

    const configDocRef = doc(db, "configs", kitchenId);

    const configDoc = await getDoc(configDocRef);

    if (!configDoc.exists()) {
      console.log("Config document does not exist!");
      return;
    }

    await updateDoc(configDocRef, {
      ...updatedConfig,
    });
  } catch (error) {
    console.error("Error updating config in Firebase:", error);
  }
};

export const updateOnlineOrderConfigInFirebase = async (
  updatedConfig: Kitchen, // Should be named `updatedConfig` to reflect it's for configuration
  kitchenId: string
) => {
  try {
    if (!kitchenId) {
      console.error("Kitchen ID is required but was not provided.");
      return;
    }

    const configDocRef = doc(db, "onlineOrdersConfigs", kitchenId);

    const configDoc = await getDoc(configDocRef);

    if (!configDoc.exists()) {
      console.log("Config document does not exist!");
      return;
    }

    await updateDoc(configDocRef, {
      ...updatedConfig,
    });
  } catch (error) {
    console.error("Error updating config in Firebase:", error);
  }
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
