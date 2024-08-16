import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment } from "react"
import Form from "../../../components/form";
import ImageUpload from "../../form/ImageUpload";

export const UserSignCode = () => {
    const {handleSave, handlePreviousStep, setStatusModal } = useFormStep()

    function handleGoForwardStep() {
        handleSave()
      }
  
    return (
        <div>
            <StaffModalHeader 
                title={'Add Staff Member'}
                handleSave={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
            <Fragment>
                  {/* <Form.StepStatus  stepIndex={4}></Form.StepStatus> */}
                    <Form.Header
                        title="Generate Code"
                        description="This code will be used by Aifanso to sign in to POS."
                    />
                    <div className="mt-5 flex flex-col gap-4">
                    {/* <ImageUpload /> */}
                    
                    </div>
            </Fragment>
        </div>
    )
}