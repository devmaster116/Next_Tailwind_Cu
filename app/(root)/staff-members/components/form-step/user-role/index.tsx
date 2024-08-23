import { Fragment, useContext, useEffect, useState } from "react";
import { useFormStep } from "@/app/hooks/useFormStep";
import { StaffModalHeader } from "../../header";
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { RoleInfo } from "@/app/src/types";
import { HelpSvg } from "@/app/assets/svg/help";
import { StaffModalFooter } from "../../footer";
import { CustomRadio } from "../../base/radio";
import useWindowSize from "@/app/hooks/useWindowSize";

export const UserRole = () => {
  const { handleNextStep, handlePreviousStep } = useFormStep();
  const { state, dispatch, getStaffRole, roles } = useContext(FormContext)!;
  const [error, setError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { width } = useWindowSize()

  const handleGoForwardStep = () => {
    if (!!state.roleName) {
      setError(false);
      handleNextStep();
    } else {
      setError(true);
    }
  };

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
                    <StaffModalHeader 
                    title={"Add Staff Member"}
                    handleGoForwardStep={handleGoForwardStep}
                    handleGoBack={handlePreviousStep}
                    >
                    <Form.StepStatus stepIndex={3}></Form.StepStatus>
                    </StaffModalHeader>
                ) : (
                    <>
                    <StaffModalHeader 
                        title={"Add Staff Member"}
                        handleGoForwardStep={handleGoForwardStep}
                        handleGoBack={handlePreviousStep}
                    />
                    <Form.StepStatus stepIndex={3}></Form.StepStatus>
                    </>
                )}

      {/* <StaffModalHeader
        title={"Add Staff Member"}
        handleGoForwardStep={handleGoForwardStep}
        handleGoBack={handlePreviousStep}
      /> */}
      <Fragment>
        {/* <Form.StepStatus stepIndex={3}></Form.StepStatus> */}
        <Form.Header
          title="Assign Role"
          description={`Manage ${state.firstName} permissions`}
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
                        ? "border-purple-700 border-2"
                        : "border-gray-300",
                    radioStyle:
                      state.roleName === item.name
                        ? "border-purple-700 border-2"
                        : "border-gray-300",
                    innerRadioStyle:
                      state.roleName !== item.name
                        ? "bg-white"
                        : "bg-purple-700 border-2",
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
      <StaffModalFooter
        title={"Add Staff Member"}
        handleGoForwardStep={handleGoForwardStep}
        handleGoBack={handlePreviousStep}
      />
    </div>
  );
};
