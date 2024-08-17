import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment } from "react"
import Form from "../../../components/form";
// @ts-ignore
import { RadioGroup, RadioButton } from 'react-radio-buttons';
export const UserRole = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()

    function handleGoForwardStep() {
          handleNextStep()
      }
  const onChange= () =>{

  }
    return (
        <div>
            <StaffModalHeader 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
            <Fragment>
                   {/* <Form.StepStatus stepIndex={3}></Form.StepStatus> */}
                    <Form.Header
                        title="Assign Role"
                        description="Manage Aifansopermissions."
                    />
                    <div className="mt-5  gap-4">
                    <RadioGroup onChange={ onChange } vertical>
                        <RadioButton value="service">
                            Service Staff
                        </RadioButton>
                        <RadioButton value="kitchen">
                            Kitchen Staff
                        </RadioButton>
                        <RadioButton value="manager">
                            Manager
                        </RadioButton>
                        <RadioButton value="melon">
                            Owner
                        </RadioButton>
                        {/* <ReversedRadioButton value="melon">
                            Melon
                        </ReversedRadioButton> */}
                        </RadioGroup>
                    
                    </div>
            </Fragment>
        </div>
    )
}