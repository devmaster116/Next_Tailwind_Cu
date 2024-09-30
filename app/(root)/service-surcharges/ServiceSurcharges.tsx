"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";
import styles from "./ServiceSurcharges.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import ServiceSurchargesModalFullPage from "./components/ServiceSurchargesModalFullPage";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Configs, SurchargeConfigs } from "@/app/src/types";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useBanner } from "@/app/context/BannerContext";
import { ToastStatus } from "@/app/components/base/toast-status";
import { PlusIcon } from "@/app/assets/svg/plusIcon";
import CustomModal from "@/app/components/CustomModal";
import { twMerge } from "tailwind-merge";

const ServiceSurcharges = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { banner, setBanner } = useBanner();
  const { loadPosConfigForEdit } = useContext(PosConfigContext)!;
  const [serviceDrop, setServiceDrop] = useState(false);
  const [saturdayDrop, setSaturdayDrop] = useState(false);
  const [sundayDrop, setSundayDrop] = useState(false);
  const [publicDrop, setPublicDrop] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [serviceSurcharges, setServiceSurcharges] =
    useState<SurchargeConfigs>();
  const OptionTypes = {
    TURN_OFF: "Turn Off",
    EDIT: "Edit",
    DELETE: "Delete",
  } as const;

  type OptionType = (typeof OptionTypes)[keyof typeof OptionTypes];

  const toggleDropdown = (value: string) => {
    switch (value) {
      case "saturday":
        setSaturdayDrop(!saturdayDrop);
        break;
      case "sunday":
        setSundayDrop(!sundayDrop);
        break;
      case "public":
        setPublicDrop(!publicDrop);
        break;
      case "service":
        setServiceDrop(!serviceDrop);
        break;
    }
  };

  const handleOptionClick = (value: string, option: OptionType) => {
    setServiceDrop(false);
    setSaturdayDrop(false);
    setSundayDrop(false);
    setPublicDrop(false);
    if (value == "saturday") {
      switch (option) {
        case OptionTypes.TURN_OFF:
          setServiceStatus(!serviceStatus);
          break;

        case OptionTypes.EDIT:
          router.push(`${pathName}?type=edit-custom-surcharge`);
          break;

        case OptionTypes.DELETE:
          setOpenDeleteModal(!openDeleteModal);
          break;

        default:
          console.warn(`Unhandled option: ${option}`);
      }
    }
    if (value == "sunday") {
      switch (option) {
        case OptionTypes.TURN_OFF:
          setServiceStatus(!serviceStatus);
          break;

        case OptionTypes.EDIT:
          router.push(`${pathName}?type=edit-custom-surcharge`);
          break;

        case OptionTypes.DELETE:
          setOpenDeleteModal(!openDeleteModal);
          break;

        default:
          console.warn(`Unhandled option: ${option}`);
      }
    }
    if (value == "public") {
      switch (option) {
        case OptionTypes.TURN_OFF:
          setServiceStatus(!serviceStatus);
          break;

        case OptionTypes.EDIT:
          router.push(`${pathName}?type=edit-custom-surcharge`);
          break;

        case OptionTypes.DELETE:
          setOpenDeleteModal(!openDeleteModal);
          break;

        default:
          console.warn(`Unhandled option: ${option}`);
      }
    }
    if (value == "service") {
      switch (option) {
        case OptionTypes.TURN_OFF:
          setServiceStatus(!serviceStatus);
          break;

        case OptionTypes.EDIT:
          router.push(`${pathName}?type=edit-custom-surcharge`);
          break;

        case OptionTypes.DELETE:
          setOpenDeleteModal(!openDeleteModal);
          break;

        default:
          console.warn(`Unhandled option: ${option}`);
      }
    }
  };

  const handleCustomSurcharges = () => {
    router.push(`${pathName}?type=add-custom-surcharge`);
  };
  const handleClose = () => {
    setBanner(false);
  };
  const updateServiceSurcharges = async () => {
    setOpenDeleteModal(!openDeleteModal);
    // if (!kitchenId) return;
    // const configDocRef = doc(db, "onlineOrdersConfigs", kitchenId);
    // setOrderType([]);
    // setBanner(true);
    // setBannerLabel("Tyro location ID has been deleted.");
    // await deleteDoc(configDocRef);
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "configs"), (snapShot) => {
      const _configs: Configs[] = [];

      snapShot.docs.forEach((data) => {
        _configs.push(data.data() as Configs);
        console.log("_configs", _configs);
      });
      setServiceSurcharges(_configs[0].surchargeConfigs);
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
            <div className="flex bg-gray-50 border-b border-gray-200 items-center font-bold text-gray-800 text-sm lg:text-base">
              <div className="flex w-1/2 lg:w-2/9 pl-3 lg:pl-6 py-3 lg:py-2 justify-between">
                Name
              </div>
              <div className="flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-3 lg:py-2">
                Amount
              </div>
              {/* Hide "Types" on mobile, show only on lg screens */}
              <div className="hidden lg:flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-3 lg:py-2">
                Types
              </div>
              <div className="flex w-1/6 lg:w-2/9 justify-center">Status</div>
              <div className="flex w-1/6 lg:w-1/9 justify-center"></div>
            </div>
            {serviceSurcharges && (
              <>
                {serviceSurcharges.saturdaySurcharge && (
                  <div className="flex border-b border-gray-200">
                    <div className="flex w-1/2 lg:w-2/9 pl-3 lg:pl-6 py-4">
                      <div className="flex flex-col">
                        <div>Saturday Surcharge</div>
                        <div className="text-gray-500">
                          Applied based on day.
                        </div>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      {serviceSurcharges.saturdaySurcharge.value * 100}%
                    </div>
                    <div className="hidden lg:flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      Weekend & Holiday
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 justify-center py-4">
                      <div className="flex flex-col">
                        <span
                          className={`rounded-2xl px-3 py-1  font-medium ${
                            serviceSurcharges.saturdaySurcharge.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : " bg-gray-100 text-gray-700"
                          }  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                        >
                          {serviceSurcharges.saturdaySurcharge.enabled
                            ? "On"
                            : "Off"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-1/9 relative">
                      <div
                        className={`flex w-full py-4 justify-center rounded-md cursor-pointer ${
                          saturdayDrop ? "bg-gray-50 p-2" : ""
                        }`}
                        onClick={() => toggleDropdown("saturday")} // Toggle dropdown on click
                      >
                        {/* Div for the three dots */}
                        <div className="flex flex-col space-y-1 ">
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                        </div>
                      </div>

                      {/* Dropdown content */}
                      {saturdayDrop && ( // Conditionally render the dropdown if it's open
                        <div className="absolute right-4 top-1/2 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded-lg text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-medium text-gray-700 z-10">
                          <ul className="px-[6px] py-[2px]">
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("saturday", "Edit")
                              }
                            >
                              Edit
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("saturday", "Turn Off")
                              }
                            >
                              Turn Off
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("saturday", "Delete")
                              }
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {serviceSurcharges.sundaySurcharge && (
                  <div className="flex border-b border-gray-200">
                    <div className="flex w-1/2 lg:w-2/9 pl-3 lg:pl-6 py-4">
                      <div className="flex flex-col">
                        <div>Sunday Surcharge</div>
                        <div className="text-gray-500">
                          Applied based on day.
                        </div>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      {serviceSurcharges.sundaySurcharge.value * 100}%
                    </div>
                    <div className="hidden lg:flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      Weekend & Holiday
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 justify-center py-4">
                      <div className="flex flex-col">
                        <span
                          className={`rounded-2xl px-3 py-1  font-medium ${
                            serviceSurcharges.sundaySurcharge.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : " bg-gray-100 text-gray-700"
                          }  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                        >
                          {serviceSurcharges.sundaySurcharge.enabled
                            ? "On"
                            : "Off"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-1/9 relative">
                      <div
                        className={`flex w-full py-4 justify-center rounded-md cursor-pointer ${
                          sundayDrop ? "bg-gray-50 p-2" : ""
                        }`}
                        onClick={() => toggleDropdown("sunday")} // Toggle dropdown on click
                      >
                        {/* Div for the three dots */}
                        <div className="flex flex-col space-y-1 ">
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                        </div>
                      </div>

                      {/* Dropdown content */}
                      {sundayDrop && ( // Conditionally render the dropdown if it's open
                        <div className="absolute right-4 top-1/2 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded-lg text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-medium text-gray-700 z-10">
                          <ul className="px-[6px] py-[2px]">
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("sunday", "Edit")
                              }
                            >
                              Edit
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("sunday", "Turn Off")
                              }
                            >
                              Turn Off
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("sunday", "Delete")
                              }
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {serviceSurcharges.publicHolidaySurcharge && (
                  <div className="flex border-b border-gray-200">
                    <div className="flex w-1/2 lg:w-2/9 pl-3 lg:pl-6 py-4">
                      <div className="flex flex-col">
                        <div>Public Holidays</div>
                        <div className="text-gray-500">
                          Enabled on day manually.
                        </div>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      {serviceSurcharges.publicHolidaySurcharge.value * 100}%
                    </div>
                    <div className="hidden lg:flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                      Weekend & Holiday
                    </div>
                    <div className="flex w-1/6 lg:w-2/9 justify-center py-4">
                      <div className="flex flex-col">
                        <span
                          className={`rounded-2xl px-3 py-1  font-medium ${
                            serviceSurcharges.publicHolidaySurcharge.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : " bg-gray-100 text-gray-700"
                          }  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                        >
                          {serviceSurcharges.publicHolidaySurcharge.enabled
                            ? "On"
                            : "Off"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-1/6 lg:w-1/9 relative">
                      <div
                        className={`flex w-full py-4 justify-center rounded-md cursor-pointer ${
                          publicDrop ? "bg-gray-50 p-2" : ""
                        }`}
                        onClick={() => toggleDropdown("public")} // Toggle dropdown on click
                      >
                        {/* Div for the three dots */}
                        <div className="flex flex-col space-y-1 ">
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                          <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                        </div>
                      </div>

                      {/* Dropdown content */}
                      {publicDrop && ( // Conditionally render the dropdown if it's open
                        <div className="absolute right-4 top-1/2 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded-lg text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-medium text-gray-700 z-10">
                          <ul className="px-[6px] py-[2px]">
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("public", "Edit")
                              }
                            >
                              Edit
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("public", "Turn Off")
                              }
                            >
                              Turn Off
                            </li>
                            <li
                              className="px-[10px] py-[9px] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                              onClick={() =>
                                handleOptionClick("public", "Delete")
                              }
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {serviceSurcharges.customSurcharges &&
                  serviceSurcharges.customSurcharges.map((item, index) => {
                    return (
                      <div className="flex" key={index}>
                        <div className="flex w-1/2 lg:w-2/9 pl-3 lg:pl-6 py-4">
                          <div className="flex flex-col">
                            <div>Service Surcharge</div>
                            <div className="text-gray-500">
                              Applied at checkout.
                            </div>
                          </div>
                        </div>
                        <div className="flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                          {item.surchargeValue * 100}%
                        </div>
                        <div className="hidden lg:flex w-1/6 lg:w-2/9 pl-2 lg:pl-6 py-4">
                          Custom
                        </div>
                        <div className="flex w-1/6 lg:w-2/9 justify-center py-4">
                          <div className="flex flex-col">
                            <span
                              className={`rounded-2xl px-3 py-1  font-medium ${
                                item.enabled
                                  ? "bg-emerald-50 text-emerald-700"
                                  : " bg-gray-100 text-gray-700"
                              }  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                            >
                              {item.enabled ? "On" : "Off"}
                            </span>
                          </div>
                        </div>
                        <div className="flex w-1/6 lg:w-1/9 relative">
                          <div
                            className={`flex w-full py-4 justify-center rounded-md cursor-pointer ${
                              serviceDrop ? "bg-gray-50 p-2" : ""
                            }`}
                            onClick={() => toggleDropdown("service")} // Toggle dropdown on click
                          >
                            {/* Div for the three dots */}
                            <div className="flex flex-col space-y-1 ">
                              <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                              <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                              <div className="w-1 h-1 rounded-full bg-purple-700"></div>
                            </div>
                          </div>

                          {/* Dropdown content */}
                          {serviceDrop && ( // Conditionally render the dropdown if it's open
                            <div className="absolute right-4 top-1/2 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded-lg text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-medium text-gray-700 z-10">
                              <ul className="px-[6px] py-[2px]">
                                <li
                                  className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    handleOptionClick("service", "Edit")
                                  }
                                >
                                  Edit
                                </li>
                                <li
                                  className="px-[10px] py-[9px] hover:bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    handleOptionClick("service", "Turn Off")
                                  }
                                >
                                  Turn Off
                                </li>
                                <li
                                  className="px-[10px] py-[9px] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                  onClick={() =>
                                    handleOptionClick("service", "Delete")
                                  }
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
        {openDeleteModal && (
          <CustomModal
            show={openDeleteModal}
            onClose={() => handleOptionClick("saturday", "Delete")}
            type="delete"
            title=""
            onUpdateClick={updateServiceSurcharges}
            confirmButtonText="Delete Now"
            cancelButtonText="Keep Surcharge"
            content={
              <>
                <h3
                  className={twMerge(styles.deleteModalTitle, "text-gray-900")}
                >
                  Delete Custom Surcharge
                </h3>
                <p className={styles.deleteMessage}>
                  Are you sure you want to delete 'Service Surcharge'
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
