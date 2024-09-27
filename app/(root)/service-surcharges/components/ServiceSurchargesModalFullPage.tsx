import React, { useContext } from "react";
import styles from "./ServiceSurchargesModalFullPage.module.scss";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import useWindowSize from "@/app/hooks/useWindowSize";
import {useRouter, useSearchParams } from "next/navigation";
import ServiceSurcharges from "./service-surcharges-edit";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";

const ServiceSurchargesModalFullPage = ({
  type,
  editPage,
}: {
  type: "edit";
  editPage: "add-custom-surcharge" | "edit-custom-surcharge";
}) => {
  const { width } = useWindowSize();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    setUpdatePosRegisterScreenClicked,
    setUpdatePosOrderFlowClicked,
    setUpdatePosSecurityClicked,
    pageKey,
    setPageKey,
   } = useContext(PosConfigContext)!;

   const { 
    setUpdatePosOrderTypesClicked,
   } = useContext(OnlineOrderConfigContext)!;

  const handleCloseModal = () => {
    setPageKey(pageKey + 1);
    router.back();

  };


  const handleUpdateStaff = () => {
    if (searchParams?.get("type") === "add-custom-surcharge") {
       setUpdatePosRegisterScreenClicked(true);
    }
    if (searchParams?.get("type") === "edit-custom-surcharge") {
       setUpdatePosOrderFlowClicked(true);
    }
  };


  return (
    <>
      {type == "edit" && (
        <div className="flex flex-col w-full h-[90%]  lg:h-full bg-white ">
          <div className="flex flex-col gap-8">
            <div
              className={twMerge(
                styles.titleDiv,
                width < 1024 ? "flex-col" : "",
                "!m-0 !relative"
              )}
            >
              <div className="flex justify-between items-center w-full">
                <button
                  className={styles.titleAddCloseBtn}
                  onClick={handleCloseModal}
                >
                  <Image
                    className={styles.icon}
                    src="/icons/close.svg"
                    height={12}
                    width={12}
                    alt="Close Button"
                    style={{
                      filter:
                        "invert(35%) sepia(5%) saturate(368%) hue-rotate(175deg) brightness(98%) contrast(90%)",
                    }}
                  />
                </button>
                <div className={styles.titleText}>
                  {editPage == "add-custom-surcharge" && "Add Custom Surcharge"}
                  {editPage == "edit-custom-surcharge" && "Edit Custom Surcharge"}
                </div>
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleUpdateStaff}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div
            className={twMerge(
              styles.modalContent,
              "!px-4 overflow-auto w-full",
              "!pt-6 lg:!pt-8",
              "lg:!w-[680px] mx-auto"
            )}
          >
            {editPage == "add-custom-surcharge" && (
              <>
                <ServiceSurcharges.AddCustomSurcharge  key={pageKey}/>
              </>
            )}
            {editPage == "edit-custom-surcharge" && (
              <>
                <ServiceSurcharges.EditCustomSurcharge key={pageKey}/>
              </>
            )}
          
          </div>
          <div className={twMerge(styles.modalFooter, "")}>
            <button
              type="button"
              className={styles.updateBtn}
              onClick={handleUpdateStaff}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceSurchargesModalFullPage;
