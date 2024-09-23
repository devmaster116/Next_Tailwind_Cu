"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import styles from "./ServiceSurcharges.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import ServiceSurchargesModalFullpage from "./components/ServiceSurchargesModalFullpage";

import { collection, onSnapshot, } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Configs} from "@/app/src/types";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { ServiceSurchargesContext } from "@/app/context/ServiceSurchargesContext";
import { useBanner } from "@/app/context/BannerContext";
import { ToastStatus } from "@/app/components/base/toast-status";
const ServiceSurcharges = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { banner, setBanner } = useBanner();
  const {loadPosConfigForEdit} = useContext(PosConfigContext)!;
  const {loadOnlineOrderForEdit} = useContext(ServiceSurchargesContext)!;
  const showEditRegisterScreenModal = () => {
    router.push(`${pathName}?type=edit-custom-surcharge`);
  };
  const showEditOrderFlowModal = () => {
    router.push(`${pathName}?type=add-custom-surcharge`);
  };
  const handleClose = () => {
    setBanner(false);
  };

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "configs"), snapShot => {
      const _configs: Configs[] = [];

      snapShot.docs.forEach(data => {
        _configs.push(data.data() as Configs);
      });
      // setPosConfig(_configs);
      loadPosConfigForEdit(_configs[0]);
   
    });
    return () => unsubscribe();
  }, []);



  return (
    <>
         {banner && (
      <ToastStatus
        label={`Saturday Surcharge updated.`}
        onClose={handleClose}
      />
    )}
    <div className="lg:mt-6 mt-5" >
          <div className={styles.pageTitle}>
           POS Configuration
          </div>
          <div className="flex flex-col lg:w-1/2 w-full lg:mt-8">
              
          </div>
          <Drawer
          open={searchParams?.get("type") === "edit-custom-surcharge"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <ServiceSurchargesModalFullpage type="edit" editPage="edit-custom-surcharge" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "add-custom-surcharge"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <ServiceSurchargesModalFullpage type="edit" editPage="add-custom-surcharge" />
        </Drawer>
 
    </div>
    </>
   
  );
};

export default withAuth(ServiceSurcharges);
