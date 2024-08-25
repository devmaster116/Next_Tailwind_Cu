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
import { Tooltip } from 'react-tooltip'
export const UserRole = () => {
  const { handleNextStep, handlePreviousStep } = useFormStep();
  const { state, dispatch, getStaffRole, roles } = useContext(FormContext)!;
  const [error, setError] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { width } = useWindowSize()
  const {nextClicked, setNextClicked} =useFormStep()

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
  useEffect(() => {
    if (nextClicked) {
      handleGoForwardStep()
    }
    return () => {
      // Cleanup: Reset `nextClicked` to false after the effect runs to avoid repetitive calls
      setNextClicked(false);
    };
  }, [nextClicked]);
  // Get the user roleName and role ID
  useEffect(() => {
    getStaffRole();
  }, []);
  return (
    <div className="w-full">

      <Fragment>
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
                    <>
                      <a
                        data-tooltip-id="my-tooltip" 
                        data-tooltip-html={`<div><p>${item.name}</p><p>${item.description}</p></div>`}
                        className="truncate"
                      >
                        <HelpSvg />
                      </a>
                      <Tooltip 
                        id="my-tooltip" 
                        className="max-w-[320px]" 
                        place={"bottom"}
                        positionStrategy={'fixed'}
                      />
                    </>
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
                  <Tooltip id="my-tooltip" />
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
