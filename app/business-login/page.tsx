import React from "react";
import LoginPage from "../components/LoginPage";
import BusinessLoginLayout from "./layout";
import { UserProvider } from "../context/UserContext";
import { KitchenProvider } from "../context/KitchenContext";

const Page = () => {
  return (
    <UserProvider>
      <KitchenProvider>
        <BusinessLoginLayout>
          <LoginPage />
        </BusinessLoginLayout>
      </KitchenProvider>
    </UserProvider>
  );
};

export default Page;
