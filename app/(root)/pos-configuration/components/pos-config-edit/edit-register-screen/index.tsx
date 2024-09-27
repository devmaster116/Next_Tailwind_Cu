import { useKitchen } from "@/app/context/KitchenContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../../ToggleSwitch";
import { updatePosConfigInFirebase } from "../../../data-fetching";
import { useBanner } from "@/app/context/BannerContext";
type Props = {
  key: number;
};
export const EditRegisterScreen = ({ key }: Props) => {
  const {
    updatePosRegisterScreenClicked,
    setUpdatePosRegisterScreenClicked,
    currentPosConfig, // Use state from the context
    loadPosConfigForEdit,
    setBannerLabel,
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
        setBannerLabel("Register Screen settings updated.");
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
        <div className="border-b border-gray-200">
          <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Show item images on register
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Enabling this means item images will be shown on the register
                screen
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

        <div className="flex mt-4 lg:mt-5 gap-5 justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
              Show open cash draw button
            </p>
            <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
              Enabling this allows users with access to the draw to open it
              outside of a transaction.
            </p>
          </div>

          <div className="flex flex-col">
            <ToggleSwitch
              isToggled={openCashDraw}
              onToggle={handleOpenCashDrawToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
