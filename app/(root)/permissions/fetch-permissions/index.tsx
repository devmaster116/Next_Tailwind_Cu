import { db } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";

export const fetchPermissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "permissions"));
      const permissions: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.permissions)) {
          data.permissions.forEach((permission) => {
            permissions.push({
              id: doc.id,
              name: permission.name,
              description: permission.description,
            });
          });
        }
      });
  
      return permissions;
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      throw new FirebaseError("Error fetching permissions", error.message);
    }
  };
  

  