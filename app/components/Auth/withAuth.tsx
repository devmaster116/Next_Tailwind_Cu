import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../environments/staging/firebaseConfig";

interface WithAuthProps {}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
            setAuthenticated(true);
          } else {
            router.push("/login");
          }
          setLoading(false);
        });

        return () => unsubscribe();
      }
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!authenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
