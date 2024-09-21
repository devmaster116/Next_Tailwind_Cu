"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";

import styles from "./PosConfiguration.module.scss";
import { HelpSvg } from "@/app/assets/svg/help";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Avatar } from "@/app/components/base/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import PosConfigModalFullPage from "./components/PosConfigModalFullpage";

const PosConfiguration = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const showEditRegisterScreenModal = () => {
    router.push(`${pathName}?type=edit-register-screen`);
  };
  const showEditOrderFlowModal = () => {
    router.push(`${pathName}?type=edit-order-flow`);
  };
  const showEditOrderTypesModal = () => {
    router.push(`${pathName}?type=edit-order-types`);
  };
  const showEditPosSecurityModal = () => {
    router.push(`${pathName}?type=edit-pos-security`);
  };
  return (
    <div className="lg:mt-6 mt-5" >
          <div className={styles.pageTitle}>
           POS Configuration
          </div>
          <div className="flex flex-col lg:w-1/2 w-full lg:mt-8">
                <div className="flex-row w-full lg:mb-6 mb-5" >
                    <div className=" border-gray-200 rounded-lg  border-solid border"  style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",backgroundColor:"rgba(252,252,253,1)" }}>
                          <div className="flex flex-row justify-between items-center justify-center px-4 py-2 border-solid border-b border-gray-100">
                            <p className="text-gray-800 font-bold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                              Register Screen
                            </p>
                            <button
                              className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                              onClick={() => showEditRegisterScreenModal()}
                            >
                              Edit
                            </button>
                        </div>
                        <div className="flex flex-row justify-between  justify-center bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row ">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Show item images on register
                                      </p>
                                  </div>
                                  <div className="flex-row">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                  className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                >
                              On
                              </span>        
                            </div>
                        </div>

                        <div className="flex flex-row justify-between  justify-center rounded-b-2xl  bg-white pl-4 pr-3 py-4 ">
                            <div className="flex items-center ">
                                  <div className="flex-row ">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Show open cash draw button
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                              <span
                                  className="rounded-2xl px-3 py-1 bg-gray-100 font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                >
                              Off
                              </span>        
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-row w-full lg:mb-6 mb-5" >
                    <div className=" border-gray-200 rounded-lg  border-solid border"  style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}>
                          <div className="flex flex-row justify-between items-center justify-center px-4 py-2 border-solid border-b border-gray-100">
                            <p className="text-gray-800 font-bold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                             Order Flow
                            </p>
                            <button
                              className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                              onClick={() => showEditOrderFlowModal()}
                            >
                              Edit
                            </button>
                        </div>
                        <div className="flex flex-row justify-between  justify-center bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Manadatory Prepayment
                                      </p>
                                  </div>
                                  <div className="flex-row">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                  className="rounded-2xl px-3 py-1 bg-gray-100 font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                >
                              Off
                              </span>       
                            </div>
                        </div>

                        <div className="flex flex-row justify-between  justify-center   bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className="text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                         Mark orders as Ready
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                    className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                On
                              </span>          
                            </div>
                        </div>
                        <div className="flex flex-row justify-between  justify-center   bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                        Mark orders as Complete
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                    className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                On
                              </span>          
                            </div>
                        </div>
                        <div className="flex flex-row justify-between  justify-center rounded-b-2xl  bg-white pl-4 pr-3 py-4 ">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className="text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                      Split payments by amount
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                    className="rounded-2xl px-3 py-1 bg-gray-100 font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                Off
                                </span>         
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-row w-full lg:mb-6 mb-5" >
                    <div className=" border-gray-200 rounded-lg  border-solid border"  style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",backgroundColor:"rgba(252,252,253,1)" }}>
                          <div className="flex flex-row justify-between items-center justify-center px-4 py-2 border-solid border-b border-gray-100">
                            <p className="text-gray-800 font-bold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                            Order Types
                            </p>
                            <button
                              className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                              onClick={() => showEditOrderTypesModal()}        
                          >
                              Edit
                            </button>
                        </div>
                        <div className="flex flex-row justify-between  justify-center bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Take Away
                                      </p>
                                  </div>
                                  <div className="flex-row">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                  className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                >
                              On
                              </span>        
                            </div>
                        </div>

                        <div className="flex flex-row justify-between  justify-center rounded-b-2xl  bg-white pl-4 pr-3 py-4 ">
                            <div className="flex items-center  ">
                                  <div className="flex-row">
                                      <p className="text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Dine In
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                              <span
                                  className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                >
                              On
                              </span>          
                            </div>
                        </div>
                    </div>
                </div>        
                <div className="flex-row w-full lg:mb-6 mb-5" >
                    <div className=" border-gray-200 rounded-lg  border-solid border"  style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}>
                          <div className="flex flex-row justify-between items-center justify-center px-4 py-2 border-solid border-b border-gray-100">
                            <p className="text-gray-800 font-bold text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                             POS Security
                            </p>
                            <button
                              className="cursor-pointer font-semibold text-purple-700 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]"
                              onClick={() => showEditPosSecurityModal()}        
                          >
                              Edit
                            </button>
                        </div>
                        <div className="flex flex-row justify-between  justify-center bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className=" text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                          Staff Member Feature
                                      </p>
                                  </div>
                                  <div className="flex-row">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                               <span
                                    className="rounded-2xl px-3 py-1 bg-emerald-50 font-medium text-emerald-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                On
                              </span>        
                            </div>
                        </div>

                        <div className="flex flex-row justify-between  justify-center   bg-white pl-4 pr-3 py-4 border-solid border-b border-gray-100">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className="text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                         Staff Sign in Code
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                    className="rounded-2xl px-3 py-1 bg-gray-100 font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                Off
                                </span>         
                            </div>
                        </div>
                        <div className="flex flex-row justify-between  justify-center rounded-b-2xl  bg-white pl-4 pr-3 py-4 ">
                            <div className="flex items-center ">
                                  <div className="flex-row">
                                      <p className="text-gray-800 font-medium text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                      Inactivity Timeout
                                      </p>
                                  </div>
                                  <div className="flex-row ">
                                      <Avatar
                                        icon={
                                          <>
                                            <a data-tooltip-id="my-tooltip" className="truncate">
                                              <HelpSvg />
                                            </a>
                                            {/* <ReactTooltip
                                              id="my-tooltip"
                                              className="max-w-[320px] !rounded-lg"
                                              place="bottom"
                                              positionStrategy="fixed"
                                            >
                                              <div>
                                                <p className="text-white text-xs font-semibold">
                                                
                                                </p>
                                                <p className="text-white text-xs font-normal">
                                                </p>
                                              </div>
                                            </ReactTooltip> */}
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                    className=" font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                                  >
                                2 Minutes
                                </span>         
                            </div>
                        </div>
                    </div>
                </div>                
          </div>
          <Drawer
          open={searchParams?.get("type") === "edit-register-screen"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <PosConfigModalFullPage type="edit" editPage="register-screen" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-order-flow"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <PosConfigModalFullPage type="edit" editPage="order-flow" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-order-types"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <PosConfigModalFullPage type="edit" editPage="order-types" />
        </Drawer>
        <Drawer
          open={searchParams?.get("type") === "edit-pos-security"}
          direction="bottom"
          className="w-full !h-full "
          lockBackgroundScroll={true}
          overlayOpacity={0}
        >
          <PosConfigModalFullPage type="edit" editPage="pos-security" />
        </Drawer>
 
    </div>
  );
};

export default withAuth(PosConfiguration);
