import { Fragment, useContext, useEffect, useState } from "react";
import { useFormStep } from "@/app/hooks/useFormStep";
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { RoleInfo } from "@/app/src/types";
import { HelpSvg } from "@/app/assets/svg/help";
import { CustomRadio } from "../../base/radio";
import { useKitchen } from "@/app/context/KitchenContext";
import { StaffEditModalHeader } from "../edit-header";
import { StaffEditModalFooter } from "../edit-footer";
import useWindowSize from "@/app/hooks/useWindowSize";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const EditUserRole = () => {
  const { state, dispatch, getStaffRole, roles,currentStaff,updateStaffInFirebase,resetForm } = useContext(FormContext)!;
  const [error, setError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const { width } = useWindowSize()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const handleGoForwardStep = async() => {
    if(currentStaff) {
      try {
        await updateStaffInFirebase({
          ...currentStaff,
          roleName: state.roleName, // Updated role name
          roleID: state.roleID, // Updated role ID
        },kitchenId);

        nextSearchParams.delete('type')
        router.replace(`${pathname}?${nextSearchParams}`)
        resetForm()
        
      } catch (error) {
        console.error("Error updating staff:", error);
      }
    }
  }
  useEffect(() => {
    if (currentStaff) {
      dispatch({ type: "SET_USER_ROLE", payload: currentStaff.roleName });
      dispatch({ type: "SET_USER_ROLE_ID", payload: currentStaff.roleID });
    }
  }, [currentStaff]);

  const onChange = (value: string) => {
    const selectedRole = roles?.find((role: RoleInfo) => role.name === value);
    if (selectedRole) {
      dispatch({ type: "SET_USER_ROLE", payload: selectedRole.name });
      dispatch({ type: "SET_USER_ROLE_ID", payload: selectedRole.id });
    }
  };

  // Get the user roleName and role ID
  useEffect(() => {
    getStaffRole();
  }, []);

  const handleCloseModal=() => {
    nextSearchParams.delete('type')
    router.replace(`${pathname}?${nextSearchParams}`)
    resetForm()
  }

  const handleMouseEnter = (description: string, name: string, index: number) => {
    setTooltip(`${name}: ${description}`);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredIndex(null);
  };

  return (
    <div className="w-full">
        {width < 1024 ? (
                <StaffEditModalHeader 
                  title={"Update Permissions"}
                  handleGoForwardStep={handleGoForwardStep}
                  handleClose={handleCloseModal}
                >
                  <Form.StepStatus stepIndex={3}></Form.StepStatus>
                </StaffEditModalHeader>
              ) : (
                <>
                  <StaffEditModalHeader 
                    title={"Update Permissions"}
                    handleGoForwardStep={handleGoForwardStep}
                    handleClose={handleCloseModal}
                  />
                  <Form.StepStatus stepIndex={3}></Form.StepStatus>
                </>
              )}
      <Fragment>
        <Form.Header
          title="Assign Role"
          description={`Manage ${currentStaff?.firstName} permissions.`}
        />

        <div className="flex flex-col gap-3 w-full my-5 lg:my-8">
          {roles &&
            roles.map((item: RoleInfo, index: number) => (
              <div className="relative" key={index}>
                <CustomRadio
                  label={item.name}
                  onChange={() => onChange(item.name)}
                  icon={
                    <div
                      onMouseEnter={() => handleMouseEnter(item.description, item.name, index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <HelpSvg />
                    </div>
                  }
                  classOverride={{
                    labelContainer:
                      "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700",
                    container:
                      state.roleName === item.name
                        ? "border-purple-700"
                        : "border-gray-300",
                    radioStyle:
                      state.roleName === item.name
                        ? "border-purple-700"
                        : "border-gray-300",
                    innerRadioStyle:
                      state.roleName !== item.name
                        ? "bg-white"
                        : "bg-purple-700",
                  }}
                />
                {/* Tooltip */}
                {hoveredIndex === index && tooltip && (
                  <div className="absolute left-[8px] bottom-[60%] transform translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded-md z-10000 w-[247px] h-[94px]">
                    {tooltip}
                  </div>
                )}
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
      </Fragment>
      <StaffEditModalFooter
        title={"Update Permissions"}
        handleGoForwardStep={handleGoForwardStep}
        handleClose={handleCloseModal}
      />
    </div>
  );
};
