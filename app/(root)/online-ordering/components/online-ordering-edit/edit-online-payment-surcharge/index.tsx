import { CustomRadio } from "../../../../../components/base/radio";
import Input from "@/app/components/Input";
import { useContext, useEffect, useState } from "react";
import { validateNumber } from "@/app/components/Auth/utils/helper";
import { updateOnlineOrderConfigInFirebase } from "../../../data-fetching";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { useKitchen } from "@/app/context/KitchenContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useBanner } from "@/app/context/BannerContext";
import { twMerge } from "tailwind-merge";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import Image from "next/image";

type Props = {
  key: number;
};
export const EditOnlinePaymentSurcharge = ({ key }: Props) => {
  const {
    updateOnlinePaymentSurchargeClicked,
    setUpdateOnlinePaymentSurchargeClicked,
    currentOnlineOrderConfig,
    loadOnlineOrderForEdit,
  } = useContext(OnlineOrderConfigContext)!;
  const { setBannerLabel } = useContext(PosConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<string>("");

  const [noPassFee, setNoPassFee] = useState(
    currentOnlineOrderConfig?.cardFeePercent > 0 ? true : false
  );
  const [cardFeePercent, setCardFeePercent] = useState(
    currentOnlineOrderConfig?.cardFeePercent || 0
  );
  const [cardFeeFixedCharge, setCardFeeFixedCharge] = useState(
    currentOnlineOrderConfig?.cardFeeFixedCharge || 0
  );
  const [showOtherReady, setShowOtherReady] = useState(false);
  const { setBanner } = useBanner();

  const onChange = (value: string) => {
    if (value === "0%") {
      setCardFeePercent(0);
      setCardFeeFixedCharge(0);
    }
    setNoPassFee(true);
    setShowOtherReady(false);
    setErrors("");
  };

  const handleOtherReadyTime = () => {
    setShowOtherReady(true);
    setErrors("");
    setNoPassFee(false);
  };

  const handleFeeInputChange = (type: "percent" | "fixed", value: string) => {
    console.log("value", value);

    const numValue = parseFloat(value);
    // if (type === "percent") {
    //   console.log("num", numValue);
    //   setCardFeePercent(numValue);
    // } else {
    //   setCardFeeFixedCharge(numValue);
    // }
    if (!isNaN(numValue) || value === "") {
      if (type === "percent") {
        setCardFeePercent(value === "" ? 0 : numValue);
      } else {
        setCardFeeFixedCharge(value === "" ? 0 : numValue);
      }
    }
    if (cardFeePercent >= 1.9 || cardFeeFixedCharge >= 95) {
      setErrors(
        "The surcharge you pass on can’t be more than the online payment fee (1.9% + 95¢)"
      );
    } else {
      setErrors("");
    }
  };

  const FuncUpdateOnlinePayment = async () => {
    if (showOtherReady) {
      if (cardFeePercent >= 1.9 || cardFeeFixedCharge >= 95) {
        setErrors(
          "The surcharge you pass on can’t be more than the online payment fee (1.9% + 95¢)"
        );
      } else {
        setErrors("");
      }
    }
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-online-payment-surcharge") {
        router.back();

        const configs = {
          ...currentOnlineOrderConfig,
          cardFeePercent,
          cardFeeFixedCharge,
        };

        loadOnlineOrderForEdit(configs);
        setBanner(true);
        setBannerLabel("Online Payment Surcharge updated.");
        await updateOnlineOrderConfigInFirebase(configs, kitchenId);
      }
    } catch (error) {
      console.error("Error updating online payment:", error);
    }
  };

  useEffect(() => {
    if (updateOnlinePaymentSurchargeClicked) {
      FuncUpdateOnlinePayment();
    }
    return () => {
      setUpdateOnlinePaymentSurchargeClicked(false);
    };
  }, [updateOnlinePaymentSurchargeClicked]);

  return (
    <div className="w-full" key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        Online payment fee is 1.9% + 11¢ per transaction.
        <br></br>
        <br></br>
        Below you have the option to pass part or all of the fee to the customer
      </p>

      <div className="mt-5 lg:mt-8">
        <div className="w-full mb-3">
          <CustomRadio
            label={"Don't pass on a fee"}
            checked={noPassFee}
            onChange={() => onChange("0%")}
            classOverride={{
              labelContainer:
                "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
              container: noPassFee
                ? "shadow-[inset_0_0_0_2px_rgba(168,85,247)] "
                : "border-gray-300",
              radioStyle: noPassFee ? " border-2" : "border-gray-300",
              innerRadioStyle: !noPassFee ? "bg-white" : "bg-purple-700 ",
            }}
          />
        </div>
        <div className="w-full  ">
          <div
            className={twMerge(
              "items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer",
              showOtherReady ? "border-purple-700 border-2" : "border-gray-300"
            )}
            onClick={() => handleOtherReadyTime()}
          >
            <div className="flex  justify-between ">
              <div className=" items-center justify-center gap-2 text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700">
                Other Ready Time
              </div>
              <div
                className={twMerge(
                  "flex justify-center items-center border rounded-full w-5 h-5",
                  showOtherReady
                    ? "border-purple-700 border-2"
                    : "border-gray-300"
                )}
              >
                {showOtherReady && (
                  <div
                    className={twMerge(
                      "w-3 h-3 rounded-full",
                      !showOtherReady ? "bg-white" : "bg-purple-700 border-2"
                    )}
                  />
                )}
              </div>
            </div>
            {showOtherReady && (
              <div className=" flex w-full border-t border-solid border-gray-200 mt-4 pt-4 gap-5">
                <div className=" w-1/2 justify-between">
                  <div className="flex flex-col">
                    <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
                      Payment Surcharge
                    </p>
                  </div>
                  <div className=" relative flex flex-col h-[44px] lg:h-[48px]">
                    <input
                      type="number"
                      className={`${"bg-white"} border  ${
                        errors
                          ? "border-red-500"
                          : "border-gray-300 focus:!border-sky-500"
                      }  focus:outline-none rounded-xl px-[14px] py-[10px]   w-full h-full text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-normal text-gray-900 placeholder-gray-500`}
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                      }}
                      value={cardFeePercent.toString()}
                      placeholder={
                        !errors
                          ? "Enter Card Fee Percent"
                          : "Default display name"
                      }
                      onChange={(e) =>
                        handleFeeInputChange("percent", e.target.value)
                      }
                    />
                    {errors && (
                      <div className="absolute right-[10px] top-[15px]">
                        <Image
                          src="/icons/error.svg"
                          height={16}
                          width={16}
                          alt="Business Details icon"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-1/2">
                  <div className="flex flex-col">
                    <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
                      Fixed Fee
                    </p>
                    <Input
                      value={cardFeeFixedCharge.toString()}
                      type="number"
                      handleInputChange={(e) =>
                        handleFeeInputChange("fixed", e.target.value)
                      }
                      error={errors}
                      placeholder="Enter fixed fee"
                      inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
