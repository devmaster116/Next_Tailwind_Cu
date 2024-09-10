import { useContext, useEffect, useState } from "react";
import { useFormStep } from "@/app/hooks/useFormStep";
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { RoleInfo } from "@/app/src/types";
import { HelpSvg } from "@/app/assets/svg/help";
import { CustomRadio } from "../../../../../components/base/radio";
import { Tooltip } from "react-tooltip";
export const UserRole = () => {
  const { handleNextStep } = useFormStep();
  const { state, dispatch, getStaffRole, roles } = useContext(FormContext)!;
  const [error, setError] = useState<boolean>(false);
  const { nextClicked, setNextClicked } = useFormStep();

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
      dispatch({
        type: "SET_USER_ROLE_DESCRIPTION",
        payload: selectedRole.description,
      });
    }
  };
  useEffect(() => {
    if (nextClicked) {
      handleGoForwardStep();
    }
    return () => {
      setNextClicked(false);
    };
  }, [nextClicked]);

  useEffect(() => {
    getStaffRole();
  }, []);
  return (
    <div className="">
      <Form.Header
        title="Assign Role"
        description={`Manage ${state?.firstName}'s permissions`}
      />
      <div className="flex flex-col gap-3 w-full my-5 lg:my-8">
        {roles &&
          roles.map((item: RoleInfo, index: number) => (
            <div className="relative" key={index}>
              <CustomRadio
                label={item.name}
                onChange={() => onChange(item.name)}
                checked={state.roleName === item.name}
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
                      positionStrategy={"fixed"}
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
