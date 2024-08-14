import { db } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
export const fetchPermissions = (callback: (permissions: any[]) => void) => {
  const q = query(collection(db, "permissions"));
  
  return onSnapshot(q, (querySnapshot:any) => {
    const permissions: any[] = [];
    querySnapshot.forEach((doc:any) => {
      const data = doc.data();
      console.log(`Fetching permissions from document ID: ${doc.id}`,data);
      if (Array.isArray(data.permissions)) {
        data.permissions.forEach((permission:any) => {
          permissions.push({
            id: permission.id,
            name: permission.name,
            description: permission.description,
          });
        });
      }
    });
    callback(permissions);
    console
  }, (error) => {
    console.error("Error fetching permissions:", error);
  });
};

export const subscribeRoles = (kitchenId: string | null, callback: (data: { rolesList: any[], ownerDetails: any }) => void) => {
  if (!kitchenId) {
    console.error("Kitchen ID is required but was not provided.");
    return;
  }

  const roleDocRef = doc(db, "roles", kitchenId);

  const unsubscribe = onSnapshot(roleDocRef, (docSnapshot) => {
    const data = docSnapshot.data();
    const rolesList = data?.roles || [];
    const ownerDetails = data?.owner  ||{};
    callback({ rolesList, ownerDetails });
  });

  return unsubscribe;
};


  export const fetchRoles = async (permissions: any[]) => {
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
  
    const rolesList: any[] = [];
    let ownerDetails: any = {};
  
    rolesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (Array.isArray(data.roles)) {
        data.roles.forEach((role: { id: string; name: string; description: string; permissions: any[] }) => {
          const roleData = {
            id:role.id,
            name: role.name,
            description: role.description,
            staff: data.staff || 0,
            permissions: role.permissions || []
          };
  
          rolesList.push(roleData);
  
          if (role.name.toLowerCase() === "owner") {
            ownerDetails = roleData;
          }
        });
      }
    });
  
    const permissionNamesSet = new Set(permissions.map(p => p.label));
  
    const filteredPermissions = (ownerDetails.permissions || []).filter((permission: any) => 
      permissionNamesSet.has(permission.name)
    );
  
    return { rolesList, ownerDetails: { ...ownerDetails, permissions: filteredPermissions } };
  };

  
export const addRoleToExistingDocument = async (newRole: any,kitchenId:string) => {
  try {
    const docRef = doc(db, "roles",kitchenId );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      const existingRoles = docData.roles || [];
      console.log("Existing roles before update:", existingRoles);
      console.log("New role to add:", newRole);

      // Ensure all fields in newRole are defined
      const sanitizedNewRole = {
        ...newRole,
        permissions: newRole.permissions.map((permission: any) => ({
          id: permission.id || "",
          name: permission.name || "",
          description: permission.description || "No description available",
        })),
      };

      const updatedRoles = [...existingRoles, sanitizedNewRole];
      console.log("Updated roles:", updatedRoles);

      await updateDoc(docRef, { roles: updatedRoles });
      console.log("Role added successfully!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error adding role:", error);
  }
};