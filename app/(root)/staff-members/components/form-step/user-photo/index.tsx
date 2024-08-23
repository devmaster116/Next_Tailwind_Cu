import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment,useContext } from "react"
import Form from "../../../components/form";
import {ImageUpload} from "../../../components/form/ImageUpload";
import { FormContext } from "@/app/context/StaffContext";
import { StaffModalFooter } from "../../footer";
import useWindowSize from "@/app/hooks/useWindowSize";
export const UserPhoto = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()
    const { state } = useContext(FormContext)!;
    const { width } = useWindowSize()
    
    function handleGoForwardStep() {
        // if(state.displayImageURL!="")
          handleNextStep()
      }
    return (
        <div>
             {width < 1024 ? (
                    <StaffModalHeader 
                    title={"Add Staff Member"}
                    handleGoForwardStep={handleGoForwardStep}
                    handleGoBack={handlePreviousStep}
                    >
                    <Form.StepStatus stepIndex={2}></Form.StepStatus>
                    </StaffModalHeader>
                ) : (
                    <>
                    <StaffModalHeader 
                        title={"Add Staff Member"}
                        handleGoForwardStep={handleGoForwardStep}
                        handleGoBack={handlePreviousStep}
                    />
                    <Form.StepStatus stepIndex={2}></Form.StepStatus>
                    </>
                )}
          
            <Fragment>
                   {/* <Form.StepStatus stepIndex={2}></Form.StepStatus> */}
                    <Form.Header
                        title="Add Profile Photo"
                        description="You can add a photo for Aifonso which will appear in the POS and in your admin potal."
                    />
                    <div className="mt-6 flex flex-col ">
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
