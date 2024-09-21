"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";

import styles from "./OnlineOrdering.module.scss";
import { HelpSvg } from "@/app/assets/svg/help";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Avatar } from "@/app/components/base/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import OnlineOrderingModalFullpage from "./components/OnlineOrderingModalFullpage";

const OnlineOrdering = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const showEditOrderReadyModal = () => {
    router.push(`${pathName}?type=edit-order-ready-time`);
  };
  const showEditTyroLocationIdModal = () => {
    router.push(`${pathName}?type=edit-tyro-location-id`);
  };
  const showEditOrderTypesModal = () => {
    router.push(`${pathName}?type=edit-online-order-types`);

  };
  const showEditOnlinePaymentSurchargeModal = () => {
    router.push(`${pathName}?type=edit-online-payment-surcharge`);

  };
  return (
    <div className="lg:mt-6 mt-5" >
          <div className={styles.pageTitle}>
           Online Ordering
          </div>
          <div className="flex flex-col lg:w-1/2 w-full mt-5">
                <div className="flex-row w-full lg:mb-8 mb-5" >
                    <div className=" border-gray-200 rounded-xl  border-solid border py-2 pl-4 pr-2" >
                          <div className="flex justify-between  ">
                            <div className="flex items-center justify-center gap-[6px]">
                              <span className="flex items-center rounded-2xl bg-emerald-50 py-1 pl-[10px] pr-3">
                                <span className="flex items-center justify-center gap-[6px]">
                                  <span className="rounded-full w-[6px] h-[6px] bg-emerald-500"></span>
                                  <span className="text-emerald-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">On</span>
                                </span>
                              </span>
                              <p className="text-gray-700 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">Open until 11:30PM</p>
                            </div>
                            <div className="flex" >
                                <button
                                  className="cursor-pointer rounded-lg bg-purple-600 lg:px-[18px] px-4 py-[10px] font-semibold text-white text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] " 
                                  style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
                                  onClick={() => showEditOrderReadyModal()}
                                >
                                Resume Orders
                                </button>
                            </div>
                        </div>
                 
                    </div>
                </div>

                <div className="border-gray-200 rounded-xl  border-solid border bg-white lg:mb-8 mb-5">
                      <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   " >
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
                              <p className=" font-normal text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">15 Minutes</p>          
                          </div>
                      </div>
                      <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   " >
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
                                      34832039430340  
                              </p>          
                          </div>
                      </div>
                      <div className="flex flex-col  gap-1 p-4 border-b border-gray-200   " >
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
                                        1.9% + 9 cents passed on to customer. 
                              </p>          
                          </div>
                      </div>
                      <div className="flex flex-col  gap-1 p-4   " >
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
                                      Take Away,QR Dine in Code
                              </p>          
                          </div>
                      </div>
                </div>
                <div className="flex rounded-lg lg:px-[18px] justify-center items-center lg:px-4 px-[14px] lg:py-[10px] py-2 bg-rose-50 text-rose-700 font-semibold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                          Forget Tyro Location ID                
                </div>                                          
                
          </div>
          <Drawer
          open={searchParams?.get("type") === "edit-order-ready-time"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <OnlineOrderingModalFullpage type="edit" editPage="order-ready-times" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-tyro-location-id"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <OnlineOrderingModalFullpage type="edit" editPage="tyro-location-id" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-online-payment-surcharge"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <OnlineOrderingModalFullpage type="edit" editPage="online-payment-surcharge" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-online-order-types"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <OnlineOrderingModalFullpage type="edit" editPage="online-order-types" />
        </Drawer>
 
    </div>
  );
};

export default withAuth(OnlineOrdering);
