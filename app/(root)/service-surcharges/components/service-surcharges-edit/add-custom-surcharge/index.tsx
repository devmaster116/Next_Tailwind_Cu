import { useKitchen } from "@/app/context/KitchenContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../../ToogleSwitch";
import { updatePosConfigInFirebase } from "../../../data-fetching";
import { useBanner } from "@/app/context/BannerContext";
import Input from "@/app/components/Input";
import { validateNumber } from "@/app/components/Auth/utils/helper";

type Props = {
  key: number;
};
export const AddCustomSurcharge = ({ key }: Props) => {
  const {
    addServiceSurchargesClicked,
    setAddServiceSurchargesClicked,
    currentPosConfig, // Use state from the context
    loadPosConfigForEdit,
  } = useContext(PosConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [itemImageHidden, set] = useState(currentPosConfig?.isItemImagesHidden);
  const [applySurcharge, setApplySurcharge] = useState(true);
  const [surchargeName, setSurchargeName] = useState("");
  const [surchargeValue, setSurchargeValue] = useState("");

  const { setBanner } = useBanner();
  const [surchargeError, setSurchargeError] = useState<string>("");
  const [percentageError, setPercentageError] = useState<string>("");

  const FuncAddCustomSurcharge = async () => {
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-register-screen") {
        router.back();

        const updatedConfig = {
          ...currentPosConfig.surchargeConfigs,
          surchargeName: surchargeName,
          surchargeValue: surchargeValue,
        };
        // loadPosConfigForEdit(updatedConfig); // Dispatch the updated config
        setBanner(true);
        // await updatePosConfigInFirebase(updatedConfig, kitchenId); // Persist to Firebase
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleApplySurcharge = async () => {
    setApplySurcharge((prev) => !prev);
  };

  const handleInputChange = (option: string, value: string) => {
    console.log(option, value);
    if (option == "name") {
      if (!value) {
        setSurchargeError("Please enter a surcharge name to continue");
      } else {
        setSurchargeError("");
      }
      setSurchargeName(value);
    }
    if (option == "percentage") {
      if (!value) {
        setPercentageError("Please enter a number above 0 to continue.");
      } else if (!validateNumber(value)) {
        setPercentageError("Invalid ID format. Please enter a valid number.");
      } else {
        setPercentageError("");
      }
      setSurchargeValue(value);
    }
  };

  useEffect(() => {
    if (addServiceSurchargesClicked) {
      FuncAddCustomSurcharge();
    }
    return () => {
      setAddServiceSurchargesClicked(false);
    };
  }, [addServiceSurchargesClicked]);

  return (
    <div className="w-full" key={key}>
      <div className="mt-5 lg:mt-8">
        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Name
          </p>
          <Input
            type="text"
            value={""}
            handleInputChange={(e) => handleInputChange("name", e.target.value)}
            error={surchargeError}
            placeholder="Enter a surcharge name"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>
        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Percentage Amount
          </p>
          <Input
            type="number"
            value={""}
            handleInputChange={(e) =>
              handleInputChange("percentage", e.target.value)
            }
            error={percentageError}
            placeholder="0%"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>
        <div className="border-t border-gray-200">
          <div className="flex mt-4 lg:mt-5 gap-5 justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Apply Surcharge
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Enabling this means surcharge will be applied automatically at
                checkout.
              </p>
            </div>

            <div className="flex flex-col">
              <ToggleSwitch
                isToggled={applySurcharge}
                onToggle={handleApplySurcharge}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
