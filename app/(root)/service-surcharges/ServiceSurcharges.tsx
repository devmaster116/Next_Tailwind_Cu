"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import styles from "./ServiceSurcharges.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import ServiceSurchargesModalFullPage from "./components/ServiceSurchargesModalFullpage-2";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Configs } from "@/app/src/types";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { ServiceSurchargesContext } from "@/app/context/ServiceSurchargesContext";
import { useBanner } from "@/app/context/BannerContext";
import { ToastStatus } from "@/app/components/base/toast-status";
import { PlusIcon } from "@/app/assets/svg/plusIcon";
const ServiceSurcharges = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { banner, setBanner } = useBanner();
  const { loadPosConfigForEdit } = useContext(PosConfigContext)!;
  const { loadOnlineOrderForEdit } = useContext(ServiceSurchargesContext)!;
  const showEditRegisterScreenModal = () => {
    router.push(`${pathName}?type=edit-custom-surcharge`);
  };
  const handleCustomSurcharges = () => {
    router.push(`${pathName}?type=add-custom-surcharge`);
  };
  const handleClose = () => {
    setBanner(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), (snapShot) => {
      const _configs: Configs[] = [];

      snapShot.docs.forEach((data) => {
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
      <div className="lg:mt-6 mt-5">
        <>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Service Surcharges</h1>
            <button
              className={styles.buttonPrimary}
              onClick={handleCustomSurcharges}
            >
              <span style={{ marginRight: "8px" }}>
                <PlusIcon width={14} height={14} color="#fff" />
              </span>
              Custom Surcharge
            </button>
          </div>
        </>
        <div className="w-full mt-5 lg:mt-8">
          <div
            className="rounded-xl border border-solid border-gray-200 bg-white w-full"
            style={{
              boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
              backgroundColor: "rgba(252,252,253,1)",
            }}
          >
            <div className="flex  p-3 bg-gray-50 border-b border-solid border-gray-200 font-bold text-gray-800 text-[14x] leading-[20px] lg:text-[16px] lg:leading-[24px]">
              <div className="flex w-1/2">
                <div className="flex flex-col">Name</div>
              </div>
              <div className="flex w-1/2 justify-between">
                <div className="flex flex-col w-2/7">Amount</div>
                <div className="flex flex-col w-2/7">Types</div>
                <div className="flex flex-col w-2/7">Status</div>
                <div className="flex flex-col w-1/7"></div>
              </div>
            </div>
            <div className="flex px-3 py-4 border-b border-solid border-gray-200">
              <div className="flex w-1/2">
                <div className="flex flex-col">
                  <div className="flex">Saturday Surcharge</div>
                  <div className="flex">Applied based on day</div>
                </div>
              </div>
              <div className="flex w-1/2 justify-between">
                <div className="flex flex-col w-2/7">10%</div>
                <div className="flex flex-col w-2/7">
                  <span
                    className={`rounded-2xl px-3 py-1  font-medium bg-emerald-50 text-emerald-700  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                  >
                    On
                  </span>
                </div>
                <div className="flex flex-col w-2/7">Weekend & Holiday</div>
                <div className="flex flex-col w-1/7">Status</div>
              </div>
            </div>
            <div className="flex px-3 py-4 border-b border-solid border-gray-200">
              <div className="flex w-1/2">
                <div className="flex flex-col">
                  <div className="flex">Saturday Surcharge</div>
                  <div className="flex">Applied based on day</div>
                </div>
              </div>
              <div className="flex w-1/2 justify-between">
                <div className="flex flex-col w-2/7">10%</div>
                <div className="flex flex-col w-2/7">
                  <span
                    className={`rounded-2xl px-3 py-1  font-medium bg-emerald-50 text-emerald-700  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                  >
                    On
                  </span>
                </div>
                <div className="flex flex-col w-2/7">Weekend & Holiday</div>
                <div className="flex flex-col w-1/7">Status</div>
              </div>
            </div>
            <div className="flex px-3 py-4 border-b border-solid border-gray-200">
              <div className="flex w-1/2">
                <div className="flex flex-col">
                  <div className="flex">Saturday Surcharge</div>
                  <div className="flex">Applied based on day</div>
                </div>
              </div>
              <div className="flex w-1/2 justify-between">
                <div className="flex flex-col w-2/7">10%</div>
                <div className="flex flex-col w-2/7">
                  <span
                    className={`rounded-2xl px-3 py-1  font-medium bg-emerald-50 text-emerald-700  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                  >
                    On
                  </span>
                </div>
                <div className="flex flex-col w-2/7">Weekend & Holiday</div>
                <div className="flex flex-col w-1/7">Status</div>
              </div>
            </div>
          </div>
        </div>
        <Drawer
          open={searchParams?.get("type") === "edit-custom-surcharge"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <ServiceSurchargesModalFullPage
            type="edit"
            editPage="edit-custom-surcharge"
          />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "add-custom-surcharge"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <ServiceSurchargesModalFullPage
            type="edit"
            editPage="add-custom-surcharge"
          />
        </Drawer>
      </div>
    </>
  );
};

export default withAuth(ServiceSurcharges);
