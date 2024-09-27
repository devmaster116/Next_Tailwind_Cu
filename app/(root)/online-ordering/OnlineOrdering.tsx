"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";

import styles from "./OnlineOrdering.module.scss";
import { HelpSvg } from "@/app/assets/svg/help";
import { Tooltip as ReactTooltip, Tooltip } from "react-tooltip";
import { Avatar } from "@/app/components/base/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import OnlineOrderingModalFullPage from "./components/OnlineOrderingModalFullpage-2";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Kitchen, OnlineOrderConfig, DaySchedule } from "@/app/src/types";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { db } from "@/firebase/config";
import { PhoneSVG } from "@/app/assets/svg/phone";
import LightLoader from "@/app/components/LightLoader";
import CustomModal from "@/app/components/CustomModal";
import { twMerge } from "tailwind-merge";
import { useKitchen } from "@/app/context/KitchenContext";
import { useBanner } from "@/app/context/BannerContext";
import { PauseCircleSvg } from "@/app/assets/svg/pauseCircle";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { ToastStatus } from "@/app/components/base/toast-status";

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
  const [PauseOrResume, setPauseOrResume] = useState<boolean>(false);
  const [btnOrderOrResume, setBtnOrderOrResume] = useState<boolean>(false);
  const [orderHour, setOrderHour] = useState<string>();
  const { bannerLabel, setBannerLabel } = useContext(PosConfigContext)!;
  const { banner, setBanner } = useBanner();

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
  const showTyroLocationModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  const [isOpen, setIsOpen] = useState(false);
  const showResumeOrderModal = () => {
    setOpenResumeModal(!openResumeModal);
  };
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const updatePosConfigFunc = async () => {
    setOpenDeleteModal(!openDeleteModal);
    if (!kitchenId) return;
    const configDocRef = doc(db, "onlineOrdersConfigs", kitchenId);
    setOrderType([]);
    setBanner(true);
    setBannerLabel("Tyro location ID has been deleted.");
    await deleteDoc(configDocRef);
  };
  const updateResumeModalFunc = async () => {
    setPauseOrResume(!PauseOrResume);
    setOpenResumeModal(!openResumeModal);
  };
  const showOrderOrResume = () => {
    setBtnOrderOrResume(!btnOrderOrResume);
  };
  const handleClose = () => {
    setBanner(false);
    setBannerLabel("");
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "kitchens"), (snapShot) => {
      const _configs: Kitchen[] = [];

      snapShot.docs.forEach((data) => {
        _configs.push(data.data() as Kitchen);
      });

      if (_configs.length > 0 && _configs[0].hours?.schedule) {
        const currentDayIndex = new Date().getUTCDay();
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const currentDay = daysOfWeek[currentDayIndex];
        const currentDaySchedule = _configs[0].hours.schedule.find(
          (day) => day[currentDay]
        );

        if (currentDaySchedule) {
          const { from, to } = currentDaySchedule[currentDay];
          setOrderHour(to);

          const currentTimeInAEST = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })
          );

          const closingTime = new Date();
          const [closingHour, closingMinute] = to.split(":");
          const closingHourParsed = parseInt(closingHour);
          const closingMinuteParsed = parseInt(closingMinute);

          // Set hours and minutes for closing time in AEST
          closingTime.setHours(
            closingHour.includes("PM") && closingHourParsed < 12
              ? closingHourParsed + 12
              : closingHourParsed % 12,
            closingMinuteParsed
          );

          // Check if the current AEST time is past the closing time
          setIsOpen(currentTimeInAEST < closingTime);

          console.log(`${currentDay} from:`, from);
          console.log(`${currentDay} to:`, to);
        } else {
          console.log(`${currentDay} schedule not found`);
        }
      } else {
        console.log("No kitchen configurations found");
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);
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
    <>
      {banner && <ToastStatus label={bannerLabel} onClose={handleClose} />}

      <div className="lg:mt-6 mt-5">
        {orderType?.length > 0 ? (
          <>
            <div className={styles.pageTitle}>Online Ordering</div>

            <div className="flex flex-col lg:w-1/2 w-full mt-5">
              <div className="flex-row w-full lg:mb-8 mb-5">
                <div className=" border-gray-200 rounded-xl  border-solid border py-2 pl-4 pr-2">
                  <div className="flex justify-between  ">
                    {PauseOrResume ? (
                      <div className="flex items-center justify-center gap-[6px]">
                        {btnOrderOrResume ? (
                          <span className="flex items-center rounded-2xl bg-gray-100 py-1 pl-[10px] pr-3">
                            <span className="flex items-center justify-center gap-[6px]">
                              <span className="text-gray-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                Visual Menu Only
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center rounded-2xl bg-rose-50 py-1 pl-[10px] pr-3">
                            <span className="flex items-center justify-center gap-[6px]">
                              <span className="rounded-full w-[6px] h-[6px] bg-rose-500"></span>
                              <span className="text-rose-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                Ordering Paused
                              </span>
                            </span>
                          </span>
                        )}
                      </div>
                    ) : (
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
                          {isOpen
                            ? `Open until ${orderHour}`
                            : "Currently Closed"}
                        </p>
                        <a
                          data-tooltip-id="my-tooltip"
                          data-tooltip-html={`<div><p>${`Currently Outside Of Business Hours`}</p><p>${`You customers wont be able to submit orders outside of you business hours.
Next opening time is Wednesday 11am`}</p></div>`}
                          className="truncate"
                        >
                          <HelpSvg />
                        </a>
                        <Tooltip
                          id="my-tooltip"
                          className="max-w-[320px]"
                          place={"bottom"}
                          positionStrategy={"fixed"}
                        />
                      </div>
                    )}

                    <div className="flex">
                      {PauseOrResume ? (
                        <button
                          className="cursor-pointer rounded-lg bg-purple-600 lg:px-[18px] px-4 py-[10px] font-semibold text-white text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] "
                          style={{
                            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                          }}
                          onClick={showOrderOrResume}
                        >
                          {btnOrderOrResume ? (
                            <>Update Order Types</>
                          ) : (
                            <>Resume Ordering</>
                          )}
                        </button>
                      ) : (
                        <button
                          className="flex justify-between gap-2  rounded-lg  lg:px-[18px] justify-center items-center lg:px-4 px-[14px] lg:py-[10px] py-2 bg-rose-50 text-rose-700 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                          onClick={showResumeOrderModal}
                        >
                          <PauseCircleSvg />
                          Pause
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-gray-200 rounded-xl  border-solid border bg-white lg:mb-8 mb-5">
                <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   ">
                  <div className="flex justify-between  ">
                    <div className="flex items-center  ">
                      <p className=" text-gray-800 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                        Order Ready Times
                      </p>
                      <Avatar
                        icon={
                          <>
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-html={`<div><p>${`Order Ready Times`}</p><p>${`This setting determines what the user sees as the estimated time their order will be ready when they are ordering online.`}</p></div>`}
                              className="truncate"
                            >
                              <HelpSvg />
                            </a>
                            <Tooltip
                              id="my-tooltip"
                              className="max-w-[320px]"
                              place={"bottom"}
                              positionStrategy={"fixed"}
                            />
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
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-html={`<div><p>${`Tyro Location ID
                              `}</p><p>${`To enable your Swifti online store front you need to have a Tyro-e-Commerce location ID.`}</p></div>`}
                              className="truncate"
                            >
                              <HelpSvg />
                            </a>
                            <Tooltip
                              id="my-tooltip"
                              className="max-w-[320px]"
                              place={"bottom"}
                              positionStrategy={"fixed"}
                            />
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
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-html={`<div><p>${`Online Payment Surcharge
                              `}</p><p>${`Online payment fee is 1.9% + 11¢ per transaction.

Below you have the option to pass part or all of the fee to the customer`}</p></div>`}
                              className="truncate"
                            >
                              <HelpSvg />
                            </a>
                            <Tooltip
                              id="my-tooltip"
                              className="max-w-[320px]"
                              place={"bottom"}
                              positionStrategy={"fixed"}
                            />
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
                      {orderType && orderType[0]?.cardFeeFixedCharge}cents
                      passed on to customer.
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
                            <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-html={`<div><p>${`Online Order Types
                              `}</p><p>${`You can configure your register screen depending on your preferences.`}</p></div>`}
                              className="truncate"
                            >
                              <HelpSvg />
                            </a>
                            <Tooltip
                              id="my-tooltip"
                              className="max-w-[320px]"
                              place={"bottom"}
                              positionStrategy={"fixed"}
                            />
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
                      {[
                        orderType && orderType[0]?.takeAwayEnabled
                          ? "Take Away"
                          : "",
                        orderType && orderType[0]?.dineInEnabled
                          ? "Dine in Code"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  className="rounded-lg  lg:px-[18px] justify-center items-center lg:px-4 px-[14px] lg:py-[10px] py-2 bg-rose-50 text-rose-700 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                  onClick={showTyroLocationModal}
                >
                  Forget Tyro Location ID
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.freshPageHeader}>
              <h1 className={styles.pageTitle}>Online Ordering</h1>
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
            onClose={showTyroLocationModal}
            type="delete"
            title=""
            onUpdateClick={updatePosConfigFunc}
            confirmButtonText="Forget Now"
            cancelButtonText="Keep Location ID"
            content={
              <>
                <h3
                  className={twMerge(styles.deleteModalTitle, "text-gray-900")}
                >
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
            onClose={showResumeOrderModal}
            type="delete"
            title=""
            onUpdateClick={updateResumeModalFunc}
            cancelButtonText="Keep Accepting Orders"
            confirmButtonText="Pause Now"
            content={
              <>
                <h3
                  className={twMerge(styles.deleteModalTitle, "text-gray-900")}
                >
                  Pause Online Ordering
                </h3>
                <p className={styles.deleteMessage}>
                  Are you sure you want to pause online ordering? This will stop
                  orders coming in until you resume ordering.
                </p>
                <br />
                <p className={styles.description}>
                  You can resume online ordering any time via the POS or the
                  admin portal.
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
          <OnlineOrderingModalFullPage
            type="edit"
            editPage="order-ready-times"
          />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-tyro-location-id"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <OnlineOrderingModalFullPage
            type="edit"
            editPage="tyro-location-id"
          />
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
    </>
  );
};

export default withAuth(OnlineOrdering);
