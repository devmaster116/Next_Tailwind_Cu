import React, { useContext } from "react";
import styles from "./OnlineOrderingModalFullPage.module.scss";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import useWindowSize from "@/app/hooks/useWindowSize";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OnlineOrdering from "./online-ordering-edit";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";

const OnlineOrderingModalFullPage = ({
  type,
  editPage,
}: {
  type: "edit";
  editPage:
    | "add-tyro-location-id"
    | "order-ready-times"
    | "tyro-location-id"
    | "online-payment-surcharge"
    | "online-order-types";
}) => {
  const { width } = useWindowSize();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    setUpdateOrderReadyTimesClicked,
    setUpdateTyroLocationIdClicked,
    setUpdatePosOrderTypesClicked,
    setUpdateOnlinePaymentSurchargeClicked,
    setAddTyroLocationIdClicked,
    pageKey,
    setPageKey,
  } = useContext(OnlineOrderConfigContext)!;
  const handleCloseModal = () => {
    setPageKey(pageKey + 1);
    router.back();
  };
  const handleUpdateStaff = () => {
    if (searchParams?.get("type") === "edit-online-payment-surcharge") {
      setUpdateOnlinePaymentSurchargeClicked(true);
    }
    if (searchParams?.get("type") === "edit-order-ready-time") {
      setUpdateOrderReadyTimesClicked(true);
    }
    if (searchParams?.get("type") === "edit-online-order-types") {
      setUpdatePosOrderTypesClicked(true);
    }
    if (searchParams?.get("type") === "edit-tyro-location-id") {
      setUpdateTyroLocationIdClicked(true);
    }
    if (searchParams?.get("type") === "add-tyro-location-id") {
      setAddTyroLocationIdClicked(true);
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
                  {editPage == "order-ready-times" && "Order Ready Time"}
                  {editPage == "tyro-location-id" && "Tyro Location ID"}
                  {editPage == "add-tyro-location-id" && "Tyro Location ID"}
                  {editPage == "online-payment-surcharge" &&
                    "Online Payment Surcharge"}
                  {editPage == "online-order-types" && "Online Order Types"}
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
            {editPage == "order-ready-times" && (
              <>
                <OnlineOrdering.EditOrderReadyTimes key={pageKey} />
              </>
            )}
            {editPage == "tyro-location-id" && (
              <>
                <OnlineOrdering.EditTyroLocationId />
              </>
            )}
            {editPage == "online-payment-surcharge" && (
              <>
                <OnlineOrdering.EditOnlinePaymentSurcharge key={pageKey} />
              </>
            )}
            {editPage == "online-order-types" && (
              <>
                <OnlineOrdering.EditOrderTypes key={pageKey} />
              </>
            )}
            {editPage == "add-tyro-location-id" && (
              <>
                <OnlineOrdering.AddTyroLocationId key={pageKey} />
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

export default OnlineOrderingModalFullPage;
