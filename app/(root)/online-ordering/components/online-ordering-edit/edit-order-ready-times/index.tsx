import { CustomRadio } from "../../../../../components/base/radio";
import { useKitchen } from "@/app/context/KitchenContext";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { validateNumber } from "@/app/components/Auth/utils/helper";

import { updateOnlineOrderConfigInFirebase } from "../../../data-fetching";
import { useBanner } from "@/app/context/BannerContext";
import Input from "@/app/components/Input";
import { twMerge } from "tailwind-merge";
type Props = {
  key: number;
};

export const EditOrderReadyTimes = ({ key }: Props) => {
  const {
    updateOrderReadyTimesClicked,
    setUpdateOrderReadyTimesClicked,
    currentOnlineOrderConfig,
    loadOnlineOrderForEdit,
  } = useContext(OnlineOrderConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<string>("");

  const [idleTime, setIdleTime] = useState(
    currentOnlineOrderConfig?.orderReadyTime
  );
  const [showOtherReady, setShowOtherReady] = useState(false);
  const { setBanner } = useBanner();
  const onChange = (value: number) => {
    setIdleTime(value);
    setShowOtherReady(false);
    setErrors("");
  };
  const FuncUpdateOrderReadyTimes = async () => {
    if (!idleTime) {
      setErrors(
        "Please enter the time in minutes (numbers only) or select one of the quick options above."
      );
      return;
    }

    if (!validateNumber(idleTime.toString())) {
      setErrors("Invalid ID format. Please enter a valid number.");
      return;
    }

    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-order-ready-time") {
        router.back();

        const configs = {
          ...currentOnlineOrderConfig,
          orderReadyTime: idleTime,
        };
        console.log("configs", configs);
        loadOnlineOrderForEdit(configs);
        setBanner(true);
        await updateOnlineOrderConfigInFirebase(configs, kitchenId);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleOtherReadyTime = async () => {
    setIdleTime(0);
    setShowOtherReady(true);
    setErrors("");
  };
  const handleInputChange = (value: string) => {
    setIdleTime(Number(value));
    if (!value) {
      setErrors(
        "Please enter the time in minutes(numbers only) or select one of the quick options above"
      );
    } else if (!validateNumber(value)) {
      setErrors("Invalid ID format. Please enter a valid number.");
    } else {
      setErrors(""); // Clear the error if valid
    }
  };
  useEffect(() => {
    setIdleTime(currentOnlineOrderConfig.orderReadyTime);
  }, [currentOnlineOrderConfig]);

  useEffect(() => {
    if (updateOrderReadyTimesClicked) {
      FuncUpdateOrderReadyTimes();
    }
    return () => {
      setUpdateOrderReadyTimesClicked(false);
    };
  }, [updateOrderReadyTimesClicked]);

  return (
    <div className="w-full " key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        This setting determines what the user sees as the estimated time their
        order will be ready when they are ordering online.
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="flex w-full gap-3 mb-3">
          <div className="flex flex-col  w-1/2 ">
            <CustomRadio
              label={"5 Minutes"}
              checked={idleTime === 5}
              onChange={() => onChange(5)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 5
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 5
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 5 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
          <div className="flex flex-col w-1/2 ">
            <CustomRadio
              label={"10 Minutes"}
              checked={idleTime === 10}
              onChange={() => onChange(10)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 10
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 10
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 10 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-3 mb-3">
          <div className="flex flex-col  w-1/2 ">
            <CustomRadio
              label={"15 Minutes"}
              checked={idleTime === 15}
              onChange={() => onChange(15)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 15
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 15
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 15 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
          <div className="flex flex-col w-1/2 ">
            <CustomRadio
              label={"20 Minutes"}
              checked={idleTime === 20}
              onChange={() => onChange(20)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 20
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 20
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 20 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-3 mb-3">
          <div className="flex flex-col  w-1/2 ">
            <CustomRadio
              label={"25 Minutes"}
              checked={idleTime === 25}
              onChange={() => onChange(25)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 25
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 25
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 25 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
          <div className="flex flex-col w-1/2 ">
            <CustomRadio
              label={"30 Minutes"}
              checked={idleTime === 30}
              onChange={() => onChange(30)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 30
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 30
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 30 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-3 mb-[26px]">
          <div className="flex flex-col  w-1/2 ">
            <CustomRadio
              label={"45 Minutes"}
              checked={idleTime === 45}
              onChange={() => onChange(45)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 45
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 45
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 45 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
          <div className="flex flex-col  w-1/2 ">
            <CustomRadio
              label={"1 Hour"}
              checked={idleTime === 60}
              onChange={() => onChange(60)}
              classOverride={{
                labelContainer:
                  "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                container:
                  idleTime === 60
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                radioStyle:
                  idleTime === 60
                    ? "border-purple-700 border-2"
                    : "border-gray-300",
                innerRadioStyle:
                  idleTime !== 60 ? "bg-white" : "bg-purple-700 border-2",
              }}
            />
          </div>
        </div>
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
            <div className=" w-full border-t border-solid border-gray-200 mt-4 pt-4">
              <Input
                value={idleTime ? idleTime.toString() : ""}
                type="number"
                handleInputChange={(e) => handleInputChange(e.target.value)}
                error={errors}
                placeholder="Enter ready time in minutes"
                inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
