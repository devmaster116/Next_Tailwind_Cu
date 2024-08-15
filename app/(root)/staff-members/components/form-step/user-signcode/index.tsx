import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment } from "react"
import Form from "../../../components/form";

export const UserSignCode = () => {
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
                {/* <Form.Card> */}
                    <Form.Header
                        title="Generate Code"
                        description="This code will be used by Aifanso to sign in to POS."
                    />
                    <div className="mt-5 flex flex-col gap-4">
                    
                    </div>
                {/* </Form.Card> */}
            </Fragment>
        </div>
    )
}