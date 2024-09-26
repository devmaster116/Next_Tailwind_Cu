"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";

import styles from "./OnlineOrdering.module.scss";
import { HelpSvg } from "@/app/assets/svg/help";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Avatar } from "@/app/components/base/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import OnlineOrderingModalFullPage from "./components/OnlineOrderingModalFullPage";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { OnlineOrderConfig } from "@/app/src/types";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { db } from "@/firebase/config";
import { PhoneSVG } from "@/app/assets/svg/phone";
import LightLoader from "@/app/components/LightLoader";
import CustomModal from "@/app/components/CustomModal";
import { twMerge } from "tailwind-merge";
import { useKitchen } from "@/app/context/KitchenContext";
import { useBanner } from "@/app/context/BannerContext";

const OnlineOrdering = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [orderType, setOrderType] = useState<OnlineOrderConfig[]>([]);
  const { loadOnlineOrderForEdit } = useContext(OnlineOrderConfigContext)!;
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openResumeModal, setOpenResumeModal] = useState<boolean>(false);
  const { setBanner } = useBanner();

  const showEditOrderReadyModal = () => {
    router.push(`${pathName}?type=edit-order-ready-time`);
  };
  const showEditTyroLocationIdModal = () => {
    router.push(`${pathName}?type=edit-tyro-location-id`);
  };
  const showAddTyroLocationIdModal = () => {
    router.push(`${pathName}?type=add-tyro-location-id`);
  };
  const showEditOrderTypesModal = () => {
    router.push(`${pathName}?type=edit-online-order-types`);
  };
  const showEditOnlinePaymentSurchargeModal = () => {
    router.push(`${pathName}?type=edit-online-payment-surcharge`);
  };
  const showTyroLocationModal = (value: string) => {
    setOpenDeleteModal(true);
  };
  const showResumeOrderModal = () => {
    setOpenResumeModal(!openDeleteModal);
  };
  const openDeleteStaffModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  const openResumeModalFunc = () => {
    setOpenResumeModal(!openResumeModal);
  };
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const updatePosConfigFunc = async () => {
    setOpenDeleteModal(false);
    if (!kitchenId) return;
    const configDocRef = doc(db, "onlineOrdersConfigs", kitchenId);
    setOrderType([]);
    setBanner(true);
    await deleteDoc(configDocRef);
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "onlineOrdersConfigs"),
      (snapShot) => {
        const _configs: OnlineOrderConfig[] = [];

        snapShot.docs.forEach((data) => {
          _configs.push(data.data() as OnlineOrderConfig);
        });

        setOrderType(_configs);
        if (_configs && _configs[0]) {
          loadOnlineOrderForEdit(_configs[0]);
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <LightLoader />;
  }

  return (
    <div className="lg:mt-6 mt-5">
      {orderType?.length > 0 ? (
        <>
          <div className={styles.pageTitle}>Online Ordering</div>

          <div className="flex flex-col lg:w-1/2 w-full mt-5">
            <div className="flex-row w-full lg:mb-8 mb-5">
              <div className=" border-gray-200 rounded-xl  border-solid border py-2 pl-4 pr-2">
                <div className="flex justify-between  ">
                  <div className="flex items-center justify-center gap-[6px]">
                    <span className="flex items-center rounded-2xl bg-emerald-50 py-1 pl-[10px] pr-3">
                      <span className="flex items-center justify-center gap-[6px]">
                        <span className="rounded-full w-[6px] h-[6px] bg-emerald-500"></span>
                        <span className="text-emerald-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                          On
                        </span>
                      </span>
                    </span>
                    <p className="text-gray-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                      Open until 11:30PM
                    </p>
                  </div>
                  <div className="flex">
                    <button
                      className="cursor-pointer rounded-lg bg-purple-600 lg:px-[18px] px-4 py-[10px] font-semibold text-white text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] "
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                      }}
                      onClick={() => showResumeOrderModal()}
                    >
                      Resume Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-gray-200 rounded-xl  border-solid border bg-white lg:mb-8 mb-5">
              <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   ">
                <div className="flex justify-between  ">
                  <div className="flex items-center  ">
                    <p className=" text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Order Ready Time
                    </p>
                    <Avatar
                      icon={
                        <>
                          <a data-tooltip-id="my-tooltip" className="truncate">
                            <HelpSvg />
                          </a>
                        </>
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditOrderReadyModal()}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <p className=" font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                    {orderType && orderType[0]?.orderReadyTime} Minutes
                  </p>
                </div>
              </div>
              <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   ">
                <div className="flex justify-between  ">
                  <div className="flex items-center  ">
                    <p className=" text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Tyro Location ID
                    </p>
                    <Avatar
                      icon={
                        <>
                          <a data-tooltip-id="my-tooltip" className="truncate">
                            <HelpSvg />
                          </a>
                        </>
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditTyroLocationIdModal()}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <p className=" font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                    {orderType && orderType[0]?.tyroLocationId}
                  </p>
                </div>
              </div>
              <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   ">
                <div className="flex justify-between  ">
                  <div className="flex items-center  ">
                    <p className=" text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Online Payment Surcharge
                    </p>
                    <Avatar
                      icon={
                        <>
                          <a data-tooltip-id="my-tooltip" className="truncate">
                            <HelpSvg />
                          </a>
                        </>
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditOnlinePaymentSurchargeModal()}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <p className=" font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                    {orderType && orderType[0]?.cardFeePercent}% +{" "}
                    {orderType && orderType[0]?.cardFeeFixedCharge} passed on to
                    customer.
                  </p>
                </div>
              </div>
              <div className="flex flex-col  gap-1 p-4   ">
                <div className="flex justify-between  ">
                  <div className="flex items-center  ">
                    <p className=" text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                      Online Order Types
                    </p>
                    <Avatar
                      icon={
                        <>
                          <a data-tooltip-id="my-tooltip" className="truncate">
                            <HelpSvg />
                          </a>
                        </>
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                      onClick={() => showEditOrderTypesModal()}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <p className=" font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                    {orderType && orderType[0]?.onlineOrderTypes} Take Away,QR
                    Dine in Code
                  </p>
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                className="rounded-lg  lg:px-[18px] justify-center items-center lg:px-4 px-[14px] lg:py-[10px] py-2 bg-rose-50 text-rose-700 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                onClick={() =>
                  showTyroLocationModal(
                    orderType && orderType[0]?.tyroLocationId
                  )
                }
              >
                Forget Tyro Location ID
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.freshPageHeader}>
            <h1 className={styles.pageTitle}>Staff Members</h1>
          </div>
          <div className="bg-white flex flex-col rounded-lg border border-gray-200 px-4 py-5 mt-5 lg:mt-3">
            <div className="flex items-center justify-center pb-4">
              <div className="flex flex-col items-center ">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <PhoneSVG />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] mb-2">
                Online Ordering Not Setup
              </p>
              <p className="text-gray-800 font-normal text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] mb-4">
                You haven’t enabled online ordering yet.
              </p>
              <button
                className={styles.buttonPrimary}
                onClick={showAddTyroLocationIdModal}
              >
                Setup Now
              </button>
            </div>
          </div>
        </>
      )}
      {openDeleteModal && (
        <CustomModal
          show={openDeleteModal}
          onClose={openDeleteStaffModal}
          type="delete"
          title=""
          onUpdateClick={updatePosConfigFunc}
          confirmButtonText="Forget Now"
          cancelButtonText="Keep Location ID"
          content={
            <>
              <h3 className={twMerge(styles.deleteModalTitle, "text-gray-900")}>
                Forget Tyro Location ID
              </h3>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the tyro location ID?
              </p>
              <br />
              <p className={styles.description}>
                This action cannot be undone and all related data will be
                permanently removed.
              </p>
            </>
          }
        />
      )}

      {openResumeModal && (
        <CustomModal
          show={openResumeModal}
          onClose={openResumeModalFunc}
          type="delete"
          title=""
          onUpdateClick={updatePosConfigFunc}
          confirmButtonText="Keep Accepting Orders"
          cancelButtonText="Pause Now"
          content={
            <>
              <h3 className={twMerge(styles.deleteModalTitle, "text-gray-900")}>
                Pause Online Ordering
              </h3>
              <p className={styles.deleteMessage}>
                Are you sure you want to pause online ordering? This will stop
                orders coming in until you resume ordering.
              </p>
              <br />
              <p className={styles.description}>
                You can resume online ordering any time via the POS or the admin
                portal.
              </p>
            </>
          }
        />
      )}
      <Drawer
        open={searchParams?.get("type") === "edit-order-ready-time"}
        direction="bottom"
        className="w-full !h-full "
        lockBackgroundScroll={true}
        overlayOpacity={0}
      >
        <OnlineOrderingModalFullPage type="edit" editPage="order-ready-times" />
      </Drawer>
      <Drawer
        open={searchParams?.get("type") === "edit-tyro-location-id"}
        direction="bottom"
        className="w-full !h-full "
        lockBackgroundScroll={true}
        overlayOpacity={0}
      >
        <OnlineOrderingModalFullPage type="edit" editPage="tyro-location-id" />
      </Drawer>
      <Drawer
        open={searchParams?.get("type") === "add-tyro-location-id"}
        direction="bottom"
        className="w-full !h-full "
        lockBackgroundScroll={true}
        overlayOpacity={0}
      >
        <OnlineOrderingModalFullPage
          type="edit"
          editPage="add-tyro-location-id"
        />
      </Drawer>
      <Drawer
        open={searchParams?.get("type") === "edit-online-payment-surcharge"}
        direction="bottom"
        className="w-full !h-full "
        lockBackgroundScroll={true}
        overlayOpacity={0}
      >
        <OnlineOrderingModalFullPage
          type="edit"
          editPage="online-payment-surcharge"
        />
      </Drawer>
      <Drawer
        open={searchParams?.get("type") === "edit-online-order-types"}
        direction="bottom"
        className="w-full !h-full "
        lockBackgroundScroll={true}
        overlayOpacity={0}
      >
        <OnlineOrderingModalFullPage
          type="edit"
          editPage="online-order-types"
        />
      </Drawer>
    </div>
  );
};

export default withAuth(OnlineOrdering);
