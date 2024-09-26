import { useKitchen } from "@/app/context/KitchenContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../../ToogleSwitch";
import { updatePosConfigInFirebase } from "../../../data-fetching";
import { useBanner } from "@/app/context/BannerContext";
import Input from "@/app/components/Input";
type Props = {
  key: number;
};
export const AddCustomSurcharge = ({ key }: Props) => {
  const {
    updatePosRegisterScreenClicked,
    setUpdatePosRegisterScreenClicked,
    currentPosConfig, // Use state from the context
    loadPosConfigForEdit,
  } = useContext(PosConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [itemImageHidden, setItemImageHidden] = useState(
    currentPosConfig?.isItemImagesHidden
  );
  const [openCashDraw, setOpenCashDraw] = useState(
    currentPosConfig?.isOpenCashDraw
  );
  const { setBanner } = useBanner();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const FuncUpdateRegisterScreen = async () => {
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-register-screen") {
        router.back();

        const updatedConfig = {
          ...currentPosConfig,
          isItemImagesHidden: itemImageHidden,
          isOpenCashDraw: openCashDraw,
        };
        loadPosConfigForEdit(updatedConfig); // Dispatch the updated config
        setBanner(true);
        await updatePosConfigInFirebase(updatedConfig, kitchenId); // Persist to Firebase
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleItemImageToggle = async () => {
    setItemImageHidden((prev) => !prev);
  };

  const handleOpenCashDrawToggle = async () => {
    setOpenCashDraw((prev) => !prev);
  };
  useEffect(() => {
    setItemImageHidden(currentPosConfig?.isItemImagesHidden || false);
    setOpenCashDraw(currentPosConfig?.isOpenCashDraw || false);
  }, [currentPosConfig]);

  useEffect(() => {
    if (updatePosRegisterScreenClicked) {
      FuncUpdateRegisterScreen();
    }
    return () => {
      setUpdatePosRegisterScreenClicked(false);
    };
  }, [updatePosRegisterScreenClicked]);

  return (
    <div className="w-full" key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800">
        You can configure your register screen depending on your preferences.
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            e-Commerce location ID
          </p>
          <Input
            value={""}
            // handleInputChange={e =>
            //   handleInputChange("phoneNumber", e.target.value)
            // }
            error={errors.name}
            placeholder="Enter a surcharge name"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>
        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Percentage Amount
          </p>
          <Input
            value={""}
            // handleInputChange={e =>
            //   handleInputChange("phoneNumber", e.target.value)
            // }
            error={errors.percentage}
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
                isToggled={itemImageHidden}
                onToggle={handleItemImageToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
