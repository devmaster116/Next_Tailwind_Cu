import React, { Suspense } from "react";
import EmailSent from "./EmailSent";
import BusinessLoginLayout from "@/app/business-login/layout";

const Page = () => {
  return (
    <BusinessLoginLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <EmailSent />
      </Suspense>
      ;
    </BusinessLoginLayout>
  );
};

export default Page;
