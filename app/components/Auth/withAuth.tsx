import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase/config";
import Loading from "../Loading";
import { useUser } from "../../context/UserContext";
import { useKitchen } from "../../context/KitchenContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
                    const kitchenName = kitchenDocSnap?.data()?.kitchenName
                      ? kitchenDocSnap?.data()?.kitchenName
                      : null;
                    const stripe_customer_id = kitchenDocSnap?.data()
                      ?.stripe_customer_id
                      ? kitchenDocSnap?.data()?.stripe_customer_id
                      : null;

                    const kitchenAddress = kitchenDocSnap?.data()?.fullAddress
                      ? kitchenDocSnap?.data()?.fullAddress
                      : null;
                    const email = kitchenDocSnap?.data()?.email
                      ? kitchenDocSnap?.data()?.email
                      : null;
                    const phoneNumber = kitchenDocSnap?.data()?.phoneNumber
                      ? kitchenDocSnap?.data()?.phoneNumber
                      : null;
                    const abn = kitchenDocSnap?.data()?.abn
                      ? kitchenDocSnap?.data()?.abn
                      : null;
                    const orderCount = kitchenDocSnap?.data()?.orderCount
                      ? kitchenDocSnap?.data()?.orderCount
                      : 0;
                    const orderIdInitials = kitchenDocSnap?.data()
                      ?.orderIdInitials
                      ? kitchenDocSnap?.data()?.orderIdInitials
                      : null;

                    setKitchen({
                      kitchenId,
                      stripe_customer_id,
                      kitchenName,
                      fullAddress: kitchenAddress,
                      email,
                      phoneNumber,
                      abn,
                      orderCount,
                      orderIdInitials,
                    });
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
