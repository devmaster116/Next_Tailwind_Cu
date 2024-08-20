import { Fragment,useContext,useEffect } from "react"
import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import Form from "../../../components/form";
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { FormContext } from "@/app/context/StaffContext";
import { RoleInfo } from "@/app/src/types";
import { HelpSvg } from "@/app/assets/svg/help";
import { StaffModalFooter } from "../../footer";
export const UserRole = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()
    const { state, dispatch,getStaffRole,roles  } = useContext(FormContext)!;

    const handleGoForwardStep=()=> {
          handleNextStep()
      }
      const onChange = (value: string) => {
        // const selectedRole = roles?roles[0].find(role:RoleInfo) => role.name === value);
        const selectedRole =  roles?.find((role: RoleInfo) => role.name === value)
        if (selectedRole) {
            console.log("selectedRole",selectedRole)
          dispatch({ type: "SET_USER_ROLE", payload: selectedRole.name });
          dispatch({ type: "SET_USER_ROLE_ID", payload: selectedRole.id });
        }
      };

//get the user roleName and rold ID
    useEffect(() => {
        getStaffRole();
    }, []);

    return (
        <div>
            <StaffModalHeader 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
            <Fragment>
                   <Form.StepStatus stepIndex={3}></Form.StepStatus>
                    <Form.Header
                        title="Assign Role"
                        description="Manage Aifansopermissions."
                    />
                    <div className="mt-5  gap-4">
                      <RadioGroup onChange={onChange} vertical="true">
                            {roles&&roles.map((item:RoleInfo, index:number) => (
                            <RadioButton
                                key={index}
                                value={item.name}
                                checked={state.roleName === item.name}
                                className="font-semibold"
                            >
                                {item.name}   <HelpSvg />
                            </RadioButton>
                            ))}
                        </RadioGroup>
                    </div>
            </Fragment>
            <StaffModalFooter 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
        </div>
    )
}