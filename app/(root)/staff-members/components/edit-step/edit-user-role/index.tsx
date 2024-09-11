import { useContext, useEffect, useState } from "react";
import { useFormStep } from "@/app/hooks/useFormStep";
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { RoleInfo } from "@/app/src/types";
import { HelpSvg } from "@/app/assets/svg/help";
import { CustomRadio } from "../../../../../components/base/radio";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useKitchen } from "@/app/context/KitchenContext";
import { useRouter, useSearchParams } from "next/navigation";

export const EditUserRole = () => {
  const {
    getStaffRole,
    roles,
    currentStaff,
    updateStaffInFirebase,
    loadStaffForEdit,
  } = useContext(FormContext)!;
  const [error, setError] = useState<boolean>(false);
  const { updateUserRoleClicked, setUpdateUserRoleClicked } = useFormStep();
  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();
  const handleGoForwardStep = async () => {
    if (currentStaff && currentStaff.roleId) {
      try {
        if (searchParams?.get("type") === "edit-role") {
          router.back();
          await updateStaffInFirebase(currentStaff, kitchenId);
        }
      } catch (error) {
        console.error("Error updating staff:", error);
      }
    } else {
      setError(true);
    }
  };

  const onChange = (value: string) => {
    const selectedRole = roles?.find((role: RoleInfo) => role.name === value);
    if (selectedRole) {
      if (currentStaff) {
        const updatedStaff = {
          ...currentStaff,
          roleName: selectedRole.name,
          roleId: selectedRole.id,
        };
        loadStaffForEdit(updatedStaff);
        setError(false);
      }
    }
  };

  useEffect(() => {
    if (updateUserRoleClicked) {
      handleGoForwardStep();
    }
    return () => {
      setUpdateUserRoleClicked(false);
    };
  }, [updateUserRoleClicked]);
  useEffect(() => {
    getStaffRole();
  }, []);

  return (
    <div className="">
      <Form.Header
        title="Assign Role"
        description={`Manage ${currentStaff?.firstName}'s permissions.`}
      />
      <div className="flex flex-col gap-3 w-full my-5 lg:my-8">
        {roles &&
          roles.map((item: RoleInfo, index: number) => (
            <div className="relative" key={index}>
              <CustomRadio
                label={item.name}
                checked={currentStaff?.roleName === item.name}
                onChange={() => onChange(item.name)}
                icon={
                  <>
                    <a
                      data-tooltip-id={`my-tooltip ${item.name}`}
                      className="truncate"
                    >
                      <HelpSvg />
                    </a>
                    <ReactTooltip
                      id={`my-tooltip ${item.name}`}
                      className="max-w-[320px] !rounded-lg z-10"
                      place="bottom"
                      positionStrategy="fixed"
                    >
                      <div>
                        <p className="text-white text-xs font-semibold">
                          {item.name}
                        </p>
                        <p className="text-white text-xs font-normal">
                          {item.description}
                        </p>
                      </div>
                    </ReactTooltip>
                  </>
                }
                classOverride={{
                  labelContainer:
                    "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                  container:
                    currentStaff?.roleName === item.name
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  radioStyle:
                    currentStaff?.roleName === item.name
                      ? "border-purple-700 border-2"
                      : "border-gray-300",
                  innerRadioStyle:
                    currentStaff?.roleName !== item.name
                      ? "bg-white"
                      : "bg-purple-700 border-2",
                }}
              />
            </div>
          ))}
      </div>
      {error && (
        <div className="flex items-center justify-center">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-red-500">
            Assign a role to continue
          </p>
        </div>
      )}
    </div>
  );
};
