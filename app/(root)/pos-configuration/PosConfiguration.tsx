"use client";
import React, { useContext, useEffect, useState } from "react";
import withAuth from "@/app/components/Auth/withAuth";

import styles from "./PosConfiguration.module.scss";
import { HelpSvg } from "@/app/assets/svg/help";
import { Avatar } from "@/app/components/base/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer from "react-modern-drawer";
import PosConfigModalFullPage from "./components/PosConfigModalFullpage";

import { collection, onSnapshot, } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Configs, OnlineOrderConfig } from "@/app/src/types";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { useBanner } from "@/app/context/BannerContext";
import { ToastStatus } from "@/app/components/base/toast-status";
const PosConfiguration = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { banner, setBanner } = useBanner();
  const {loadPosConfigForEdit} = useContext(PosConfigContext)!;
  const {loadOnlineOrderForEdit} = useContext(OnlineOrderConfigContext)!;
  const [posConfig, setPosConfig] = useState<Configs[]>([]);
  const [orderType, setOrderType] =useState<OnlineOrderConfig[]>([]);
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

  const handleClose = () => {
    setBanner(false);
  };

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "configs"), snapShot => {
      const _configs: Configs[] = [];

      snapShot.docs.forEach(data => {
        _configs.push(data.data() as Configs);
      });
      setPosConfig(_configs);
      loadPosConfigForEdit(_configs[0]);
   
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "onlineOrdersConfigs"), snapShot => {
      const _configs: OnlineOrderConfig[] = [];

      snapShot.docs.forEach(data => {
        _configs.push(data.data() as OnlineOrderConfig);
      });
      setOrderType(_configs);
      loadOnlineOrderForEdit(_configs[0]);
   
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
                                       
                                      </>
                                    }
                                  />
                              </div>
                        </div>
                        <div className="flex items-center">
                          <span
                              className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.isItemImagesHidden==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                            >
                          {posConfig[0]?.isItemImagesHidden==true?'On':'Off'}  
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
                                       
                                      </>
                                    }
                                  />
                              </div>
                        
                        </div>
                        <div className="flex items-center">
                          <span
                              className={`rounded-2xl px-3 py-1 ${posConfig[0]?.isOpenCashDraw==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'} font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                            >
                               {posConfig[0]?.isOpenCashDraw==true?'On':'Off'}  

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
                                            
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                            <span
                              className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.mandatoryPrepaymentConfig==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                            >
                            {posConfig[0]?.mandatoryPrepaymentConfig==true?'On':'Off'}  
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
                                           
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.markOrderReadyConfig==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                              >
                              {posConfig[0]?.markOrderReadyConfig==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                  className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.markOrderCompletedConfig==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                                >
                                {posConfig[0]?.markOrderCompletedConfig==true?'On':'Off'}  
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
                                            
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                                <span
                                  className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.isSplitPaymentsConfigEnabled==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                                >
                                {posConfig[0]?.isSplitPaymentsConfigEnabled==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`rounded-2xl px-3 py-1  font-medium ${orderType[0]?.takeAwayEnabled==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                              >
                                {orderType[0]?.takeAwayEnabled==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                               <span
                                className={`rounded-2xl px-3 py-1  font-medium ${orderType[0]?.dineInEnabled==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                              >
                                {orderType[0]?.dineInEnabled==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            </div>
                            <div className="flex items-center">
                            <span
                                className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.staffMemberConfigs?.enabled==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                              >
                                {posConfig[0]?.staffMemberConfigs?.enabled==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                               <span
                                className={`rounded-2xl px-3 py-1  font-medium ${posConfig[0]?.staffMemberConfigs?.passCodeEnabled==true?'bg-emerald-50 text-emerald-700':' bg-gray-100 text-gray-700'}  text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]`}
                              >
                                {posConfig[0]?.staffMemberConfigs?.passCodeEnabled==true?'On':'Off'}  
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
                                          </>
                                        }
                                      />
                                  </div>
                            
                            </div>
                            <div className="flex items-center">
                             <span
                                className="font-medium text-gray-700 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
                              >
                                {posConfig[0]?.staffMemberConfigs?.idleTime !== undefined 
                                  ? `${posConfig[0]?.staffMemberConfigs?.idleTime} Minutes` 
                                  : "No Timeout Set"}
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
    </>
   
  );
};

export default withAuth(PosConfiguration);
