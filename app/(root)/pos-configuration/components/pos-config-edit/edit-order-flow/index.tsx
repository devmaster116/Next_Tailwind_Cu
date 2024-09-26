import { useKitchen } from "@/app/context/KitchenContext";
import { PosConfigContext } from "@/app/context/PosConfigContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../../ToogleSwitch";
import { updatePosConfigInFirebase } from "../../../data-fetching";
import { useBanner } from "@/app/context/BannerContext";
type Props = {
  key: number;
};
export const EditOrderFlow = ({ key }: Props) => {
  const {
    updatePosOrderFlowClicked,
    setUpdatePosOrderFlowClicked,
    currentPosConfig, // Use state from the context
    loadPosConfigForEdit,
    setBannerLabel,
  } = useContext(PosConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();

  const [mandatoryPrepaymentConfig, setMandatoryPrepaymentConfig] = useState(
    currentPosConfig?.mandatoryPrepaymentConfig
  );
  const [markOrderCompletedConfig, setMarkOrderCompletedConfig] = useState(
    currentPosConfig?.markOrderCompletedConfig
  );
  const [markOrderReadyConfig, setMarkOrderReadyConfig] = useState(
    currentPosConfig?.markOrderReadyConfig
  );
  const [isSplitPaymentsConfigEnabled, setIsSplitPaymentsConfigEnabled] =
    useState(currentPosConfig?.isSplitPaymentsConfigEnabled);
  const { setBanner } = useBanner();

  const FuncUpdateOrderFlow = async () => {
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-order-flow") {
        router.back();

        const updatedConfig = {
          ...currentPosConfig,
          mandatoryPrepaymentConfig: mandatoryPrepaymentConfig,
          markOrderCompletedConfig: markOrderCompletedConfig,
          markOrderReadyConfig: markOrderReadyConfig,
          isSplitPaymentsConfigEnabled: isSplitPaymentsConfigEnabled,
        };
        setBannerLabel("Order Flow settings updated.");
        loadPosConfigForEdit(updatedConfig); // Dispatch the updated config

        setBanner(true);

        await updatePosConfigInFirebase(updatedConfig, kitchenId); // Persist to Firebase
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleMandatoryPrepaymentToggle = async () => {
    setMandatoryPrepaymentConfig((prev) => !prev);
  };

  const handleMarkOrderAsReadyToggle = async () => {
    setMarkOrderReadyConfig((prev) => !prev);
  };
  const handleMarkOrderAsCompleteToggle = async () => {
    setMarkOrderCompletedConfig((prev) => !prev);
  };

  const handleSplitPaymentByAmountToggle = async () => {
    setIsSplitPaymentsConfigEnabled((prev) => !prev);
  };
  useEffect(() => {
    setMandatoryPrepaymentConfig(
      currentPosConfig?.mandatoryPrepaymentConfig || false
    );
    setMarkOrderReadyConfig(currentPosConfig?.markOrderReadyConfig || false);
    setMarkOrderCompletedConfig(
      currentPosConfig?.markOrderCompletedConfig || false
    );
    setIsSplitPaymentsConfigEnabled(
      currentPosConfig?.isSplitPaymentsConfigEnabled || false
    );
  }, [currentPosConfig]);

  useEffect(() => {
    if (updatePosOrderFlowClicked) {
      FuncUpdateOrderFlow();
    }
    return () => {
      setUpdatePosOrderFlowClicked(false);
    };
  }, [updatePosOrderFlowClicked]);
  return (
    <div className="w-full" key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        Configure your order flow to match your front-of-house and kitchen
        operations.
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="border-b border-gray-200">
          <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
            <div className="flex flex-col  gap-1 ">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Mandatory Prepayment
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Enabling this means an order can't be created on the unless
                payment is captured upfront.
              </p>
            </div>

            <div className="flex flex-col">
              <ToggleSwitch
                isToggled={mandatoryPrepaymentConfig}
                onToggle={handleMandatoryPrepaymentToggle}
              />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex my-4 lg:my-5 gap-5 justify-between">
            <div className="flex flex-col  gap-1 ">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Mark order as Ready
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Enabling this requires wait or kitchen stuff to mark the order
                as ready when it's fully prepared.
              </p>
            </div>

            <div className="flex flex-col">
              <ToggleSwitch
                isToggled={markOrderReadyConfig}
                onToggle={handleMarkOrderAsReadyToggle}
              />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex my-4 lg:my-5 gap-5 justify-between">
            <div className="flex flex-col  gap-1 ">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Mark order as Complete
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Enabling this means staff will need to mark the order as
                complete once it's served or collected.
              </p>
            </div>

            <div className="flex flex-col">
              <ToggleSwitch
                isToggled={markOrderCompletedConfig}
                onToggle={handleMarkOrderAsCompleteToggle}
              />
            </div>
          </div>
        </div>
        <div className="flex my-4 lg:my-5 gap-5 justify-between">
          <div className="flex flex-col  gap-1 ">
            <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
              Split payments by amount
            </p>
            <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
              Allow customers to split payments by specific amounts for post pay
              orders/bills.
            </p>
          </div>

          <div className="flex flex-col">
            <ToggleSwitch
              isToggled={isSplitPaymentsConfigEnabled}
              onToggle={handleSplitPaymentByAmountToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
