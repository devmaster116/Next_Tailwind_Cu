import { useKitchen } from "@/app/context/KitchenContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../../ToogleSwitch";
import { updateOnlineOrderConfigInFirebase } from '../../../data-fetching';
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { useBanner } from "@/app/context/BannerContext";
type Props = {
  key: number;
};
export const EditOrderTypes = ({key}:Props) => {
  const { 
    updatePosOrderTypesClicked,
    setUpdatePosOrderTypesClicked,
    currentOnlineOrderConfig , // Use state from the context
    loadOnlineOrderForEdit,
  } = useContext(OnlineOrderConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [takeAwayEnabled, setTakeAwayEnabled]=useState(currentOnlineOrderConfig?.takeAwayEnabled);
  const [dineInEnabled, setDineInEnabled]=useState(currentOnlineOrderConfig?.dineInEnabled);
  const { setBanner } = useBanner();
  const [error, setError] = useState<boolean>(false);
  const FuncUpdateRegisterScreen = async () => {
    if(!kitchenId) return ;

    try {
      if (searchParams?.get("type") === "edit-order-types") {
        router.back();
  
        const updatedConfig = {
          ...currentOnlineOrderConfig,
          takeAwayEnabled:takeAwayEnabled, 
          dineInEnabled:dineInEnabled
        };
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
  useEffect(()=>{
    setTakeAwayEnabled(currentOnlineOrderConfig?.takeAwayEnabled||false);
    setDineInEnabled(currentOnlineOrderConfig?.dineInEnabled||false);
  },[currentOnlineOrderConfig])

  useEffect(() => {
    if (updatePosOrderTypesClicked) {
      if (takeAwayEnabled==false&&dineInEnabled==false) {
        setError(true);
      } else {
        setError(false);
        FuncUpdateRegisterScreen();
      }
    }
    return () => {
      setUpdatePosOrderTypesClicked(false);
    };
  }, [updatePosOrderTypesClicked]);
  return (
        <div className="w-full" key={key}>
              <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
              Configure your order types to suit your business and fit your services style.
              </p>
              <div className="mt-5 lg:my-8 my-6">
                <div className="border-b border-gray-200">
                    <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
                          <div className="flex flex-col  gap-1 ">
                            <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                              Take Away Orders
                            </p>
                            <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                                Enabling this option to allow the creation of take-away orders for customers on the go.
                            </p>
                          </div>

                          <div className="flex flex-col">
                          <ToggleSwitch isToggled={takeAwayEnabled } onToggle={handleTakeAwayEnabledToggle} />

                          </div>
                    </div>
                </div>

                <div className="flex mt-4 lg:mt-5 gap-5 justify-between">
                          <div className="flex flex-col  gap-1 ">
                            <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                              Dine In Orders
                            </p>
                            <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                              Enable this option to allow the creation of dine-in orders for your guests.
                            </p>
                          </div>

                          <div className="flex flex-col">
                          <ToggleSwitch isToggled={dineInEnabled } onToggle={handleDineInEnabledToggle} />

                          </div>
                </div>

              </div>
              {error && (
                <div className="flex items-center justify-center">
                  <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-red-500">
                  To continue you need to select at least one order type.
                  </p>
                </div>
              )}
        </div>
  );
};
