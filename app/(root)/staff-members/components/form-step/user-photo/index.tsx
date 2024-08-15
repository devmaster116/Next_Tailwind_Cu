import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment } from "react"
import Form from "../../../components/form";
import ImageUpload from "../../../components/form/ImageUpload";

export const UserPhoto = () => {
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
                
                   <Form.StepStatus value={30} stepIndex={1}></Form.StepStatus>
                    <Form.Header
                        title="Add Profile Photo"
                        description="You can add a photo for Aifonso which will appear in the POS and in your admin potal."
                    />
                    <div className="mt-5 flex flex-col gap-4">
                      <ImageUpload />
                    </div>
                
            </Fragment>

        </div>
    )
}

function useState(arg0: null): [any, any] {
    throw new Error("Function not implemented.");
}
