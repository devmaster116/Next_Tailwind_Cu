import { Configs, OnlineOrderConfig } from "@/app/src/types";
import { db } from "@/firebase/config";
import {
  collection,
  doc,
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
  updatedConfig: OnlineOrderConfig, // Should be named `updatedConfig` to reflect it's for configuration
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