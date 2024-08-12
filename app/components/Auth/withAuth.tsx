import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase/config";
import Loading from "../Loading";
import { useUser } from "../../context/UserContext";
import { useKitchen } from "../../context/KitchenContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Kitchen } from "@/app/src/types";

interface WithAuthProps {}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const { user, setUser } = useUser();
    const { kitchen, setKitchen } = useKitchen();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          // If there is no user stored in context then retrieve user again
          if (user === null) {
            const userDocRef = doc(db, "users", authUser?.uid);

            getDoc(userDocRef).then((userDocSnap) => {
              if (userDocSnap.exists()) {
                const kitchenId = userDocSnap.data().kitchenId;
                const userEmail = userDocSnap.data().email;
                const owner = userDocSnap.data().owner ? true : false;
                const secondaryContact = userDocSnap.data().secondaryContact
                  ? true
                  : false;

                // Add timestamp for login to user object
                setDoc(
                  userDocRef,
                  {
                    lastPortalLogin: new Date(),
                    emailVerified: authUser?.emailVerified,
                  },
                  {
                    merge: true,
                  }
                );

                setUser({
                  uid: authUser?.uid,
                  email: userEmail,
                  kitchenId,
                  owner,
                  secondaryContact,
                  emailVerified: authUser?.emailVerified,
                });

                const docRef = doc(db, "kitchens", kitchenId);
                getDoc(docRef).then((kitchenDocSnap) => {
                  if (kitchenDocSnap.exists()) {
                    setKitchen(
                      kitchenDocSnap?.data() as Kitchen
                    );
                  }
                  setAuthenticated(true);
                });
              }
            });
          } else {
            setAuthenticated(true);
          }
        } else {
          router.push("/business-login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <Loading />;
    }

    if (!authenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
