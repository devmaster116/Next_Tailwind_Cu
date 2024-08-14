import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment } from "react"
import Form from "../../../components/form";

export const UserRole = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()

    function handleGoForwardStep() {
          handleNextStep()
      }
  
    return (
        <div>
            <StaffModalHeader 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
            <Fragment>
                <Form.Card>
                    <Form.Header
                        title="Assign Role"
                        description="Manage Aifansopermissions."
                    />
                    <div className="mt-5 flex flex-col gap-4">
                    
                    </div>
                </Form.Card>
            </Fragment>
        </div>
    )
}