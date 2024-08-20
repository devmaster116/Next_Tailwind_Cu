import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment,useContext } from "react"
import Form from "../../../components/form";
import {ImageUpload} from "../../../components/form/ImageUpload";
import { FormContext } from "@/app/context/StaffContext";
import { StaffModalFooter } from "../../footer";
export const UserPhoto = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()
    const { state } = useContext(FormContext)!;
    function handleGoForwardStep() {
        // if(state.displayImageURL!="")
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
                   <Form.StepStatus stepIndex={2}></Form.StepStatus>
                    <Form.Header
                        title="Add Profile Photo"
                        description="You can add a photo for Aifonso which will appear in the POS and in your admin potal."
                    />
                    <div className="mt-5 flex flex-col gap-4 ">
                        {/* {state.displayImageURL!=""&&(
                             <p className="text-red-500">"select the profile image"</p>
                        )} */}
                      <ImageUpload />
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
