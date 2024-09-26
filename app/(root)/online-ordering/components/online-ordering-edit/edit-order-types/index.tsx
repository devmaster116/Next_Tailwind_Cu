import { useKitchen } from "@/app/context/KitchenContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { updateOnlineOrderConfigInFirebase } from "../../../data-fetching";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useBanner } from "@/app/context/BannerContext";
import ToggleSwitch from "@/app/(root)/pos-configuration/components/ToogleSwitch";
type Props = {
  key: number;
};
export const EditOrderTypes = () => {
  const {
    updatePosOrderTypesClicked,
    setUpdatePosOrderTypesClicked,
    currentOnlineOrderConfig, // Use state from the context
    loadOnlineOrderForEdit,
  } = useContext(OnlineOrderConfigContext)!;
  const { setBannerLabel } = useContext(PosConfigContext)!;
  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [takeAwayEnabled, setTakeAwayEnabled] = useState(
    currentOnlineOrderConfig?.takeAwayEnabled
  );
  const [dineInEnabled, setDineInEnabled] = useState(
    currentOnlineOrderConfig?.dineInEnabled
  );
  const { setBanner } = useBanner();
  const [error, setError] = useState<boolean>(false);
  const FuncUpdateOrderType = async () => {
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-online-order-types") {
        router.back();

        const updatedConfig = {
          ...currentOnlineOrderConfig,
          takeAwayEnabled: takeAwayEnabled,
          dineInEnabled: dineInEnabled,
        };
        setBannerLabel("Order Types settings updated.");
        loadOnlineOrderForEdit(updatedConfig); // Dispatch the updated config
        setBanner(true);
        await updateOnlineOrderConfigInFirebase(updatedConfig, kitchenId); // Persist to Firebase
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleTakeAwayEnabledToggle = async () => {
    setTakeAwayEnabled((prev) => !prev);
  };

  const handleDineInEnabledToggle = async () => {
    setDineInEnabled((prev) => !prev);
  };
  useEffect(() => {
    setTakeAwayEnabled(currentOnlineOrderConfig?.takeAwayEnabled || false);
    setDineInEnabled(currentOnlineOrderConfig?.dineInEnabled || false);
  }, [currentOnlineOrderConfig]);

  useEffect(() => {
    if (updatePosOrderTypesClicked) {
      if (takeAwayEnabled == false && dineInEnabled == false) {
        setError(true);
      } else {
        setError(false);
        FuncUpdateOrderType();
      }
    }
    return () => {
      setUpdatePosOrderTypesClicked(false);
    };
  }, [updatePosOrderTypesClicked]);
  return (
    <div className="w-full">
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        You can configure your register screen depending on your preferences.
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="border-b border-gray-200">
          <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
            <div className="flex flex-col  gap-1 ">
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
                isToggled={takeAwayEnabled}
                onToggle={handleTakeAwayEnabledToggle}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-4 lg:mt-5 gap-5 justify-between">
          <div className="flex flex-col  gap-1 ">
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
              isToggled={dineInEnabled}
              onToggle={handleDineInEnabledToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
