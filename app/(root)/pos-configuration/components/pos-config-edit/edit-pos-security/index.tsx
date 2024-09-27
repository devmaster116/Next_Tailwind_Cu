import { CustomRadio } from "../../../../../components/base/radio";

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

export const EditPosSecurity = ({ key }: Props) => {
  const {
    updatePosSecurityClicked,
    setUpdatePosSecurityClicked,
    currentPosConfig,
    loadPosConfigForEdit,
    setBannerLabel,
  } = useContext(PosConfigContext)!;

  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const [enabled, setEnabled] = useState(
    currentPosConfig?.staffMemberConfigs?.enabled
  );
  const [idleTime, setIdleTime] = useState(
    currentPosConfig?.staffMemberConfigs?.idleTime
  );
  const [passCodeEnabled, setPassCodeEnabled] = useState(
    currentPosConfig?.staffMemberConfigs?.passCodeEnabled
  );
  const { setBanner } = useBanner();
  const onChange = (value: number) => {
    setIdleTime(value);
  };
  const FuncUpdatePosSecurity = async () => {
    if (!kitchenId) return;

    try {
      if (searchParams?.get("type") === "edit-pos-security") {
        router.back();

        const staffMemberConfigs = {
          ...currentPosConfig?.staffMemberConfigs,
          enabled: enabled,
          idleTime: idleTime,
          passCodeEnabled: passCodeEnabled,
        };
        const configs = {
          ...currentPosConfig,
          staffMemberConfigs: staffMemberConfigs,
        };
        setBannerLabel("POS Security settings updated.");
        loadPosConfigForEdit(configs); // Dispatch the updated config
        setBanner(true);
        await updatePosConfigInFirebase(configs, kitchenId); // Persist to Firebase
      }
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleStaffMemberModeToggle = async () => {
    setEnabled((prev) => !prev);
  };

  const handleStaffSignInCodeToggle = async () => {
    setPassCodeEnabled((prev) => !prev);
  };
  useEffect(() => {
    setEnabled(currentPosConfig?.staffMemberConfigs?.enabled || false);
    setPassCodeEnabled(
      currentPosConfig?.staffMemberConfigs?.passCodeEnabled || false
    );
    setIdleTime(currentPosConfig?.staffMemberConfigs?.idleTime);
  }, [currentPosConfig]);

  useEffect(() => {
    if (updatePosSecurityClicked) {
      FuncUpdatePosSecurity();
    }
    return () => {
      setUpdatePosSecurityClicked(false);
    };
  }, [updatePosSecurityClicked]);
  return (
    <div className="w-full" key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        Configure your security settings to track staff activity and control
        access levels
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="border-b border-gray-200">
          <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
            <div className="flex flex-col  gap-1 ">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Staff Member Mode
              </p>
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Track staff actions and set role-based permissions to limit
                access.
              </p>
            </div>

            <div className="flex flex-col">
              <ToggleSwitch
                isToggled={enabled}
                onToggle={handleStaffMemberModeToggle}
              />
            </div>
          </div>
        </div>
        <div className={`${!enabled ? "pointer-events-none opacity-50" : ""}`}>
          <div className="border-b border-gray-200">
            <div className="flex my-4 lg:my-5 gap-5 justify-between">
              <div className="flex flex-col  gap-1 ">
                <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                  Staff Sign in Code
                </p>
                <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                  Require staff to enter a passcode before using the POS.
                </p>
              </div>

              <div className="flex flex-col">
                <ToggleSwitch
                  isToggled={passCodeEnabled}
                  onToggle={handleStaffSignInCodeToggle}
                />
              </div>
            </div>
          </div>
          <div className="my-4 lg:my-5 ">
            <div className="flex  gap-1 ">
              <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                Inactivity Timeout
              </p>
            </div>
            <div className="flex  ">
              <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                Automatically lock the POS after inactivity,requiring a passcode
                to resume use.
              </p>
            </div>
          </div>
          <div className="flex w-full gap-3 mb-3">
            <div className="flex flex-col  w-1/2 ">
              <CustomRadio
                label={"No Time Out"}
                checked={idleTime === 0}
                onChange={() => onChange(0)}
                classOverride={{
                  labelContainer:
                    "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                  container:
                    idleTime === 0
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  radioStyle:
                    idleTime === 0
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  innerRadioStyle:
                    idleTime !== 0 ? "bg-white" : "bg-purple-700 border-2",
                }}
              />
            </div>
            <div className="flex flex-col w-1/2 ">
              <CustomRadio
                label={"2 Minutes"}
                checked={idleTime === 2}
                onChange={() => onChange(2)}
                classOverride={{
                  labelContainer:
                    "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                  container:
                    idleTime === 2
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  radioStyle:
                    idleTime === 2
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  innerRadioStyle:
                    idleTime !== 2 ? "bg-white" : "bg-purple-700 border-2",
                }}
              />
            </div>
          </div>
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
                label={"8 Minutes"}
                checked={idleTime === 8}
                onChange={() => onChange(8)}
                classOverride={{
                  labelContainer:
                    "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                  container:
                    idleTime === 8
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  radioStyle:
                    idleTime === 8
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  innerRadioStyle:
                    idleTime !== 8 ? "bg-white" : "bg-purple-700 border-2",
                }}
              />
            </div>
          </div>
          <div className="flex w-full gap-3 mb-3">
            <div className="flex flex-col  w-1/2 ">
              <CustomRadio
                label={"12 Minutes"}
                checked={idleTime === 12}
                onChange={() => onChange(12)}
                classOverride={{
                  labelContainer:
                    "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                  container:
                    idleTime === 12
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  radioStyle:
                    idleTime === 12
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  innerRadioStyle:
                    idleTime !== 12 ? "bg-white" : "bg-purple-700 border-2",
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
          <div className="flex w-full gap-3 mb-[26px]">
            <div className="flex flex-col  w-1/2 ">
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
            <div className="flex   w-1/2 "></div>
          </div>
        </div>
      </div>
    </div>
  );
};
