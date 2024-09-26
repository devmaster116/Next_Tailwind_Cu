import { ConfigStaffMember, OnlineOrderConfig } from "@/app/src/types";
import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
export const addOnlineOrderConfigInFirebase = async (
  tyroLocationId: string, // Should be named `updatedConfig` to reflect it's for configuration
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
      // If the document does not exist, create it
      await setDoc(configDocRef, {
        kitchenId: kitchenId, // Set the kitchenId in the document data
        tyroLocationId: tyroLocationId,
        onlineOrderTypes: "", // Default values for new config
        cardFeePercent: 1.9,
        cardFeeFixedCharge: 9,
        orderReadyTime: 15,
      });
      console.log("New online order config created successfully!");
    } else {
      // If the document exists, update the existing document
      await updateDoc(configDocRef, {
        tyroLocationId: tyroLocationId,
        onlineOrderTypes: "",
        cardFeePercent: 1.9,
        cardFeeFixedCharge: 9,
        orderReadyTime: 15,
      });
      console.log("Online order config updated successfully!");
    }

    // loadOnlineOrderForEdit(updatedConfig); // Dispatch the updated config
  } catch (error) {
    console.error("Error updating staff:", error);
  }
};
