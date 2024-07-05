import React from "react";
import LoginPage from "../components/LoginPage";
import BusinessLoginLayout from "./layout";

const Page = () => {
  return (
    <BusinessLoginLayout>
      <LoginPage />
    </BusinessLoginLayout>
  );
};

export default Page;
