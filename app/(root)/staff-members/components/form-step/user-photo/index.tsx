import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment,useContext, useEffect } from "react"
import Form from "../../../components/form";
import {ImageUpload} from "../../../components/form/ImageUpload";
import { FormContext } from "@/app/context/StaffContext";
import { StaffModalFooter } from "../../footer";
import useWindowSize from "@/app/hooks/useWindowSize";
export const UserPhoto = () => {
    const { handleNextStep, handlePreviousStep } = useFormStep()
    const { state } = useContext(FormContext)!;
    const { width } = useWindowSize()
      const {nextClicked, setNextClicked} =useFormStep()
    
    function handleGoForwardStep() {
        // if(state.displayImageURL!="")
          handleNextStep()
      }
      useEffect(() => {
        if (nextClicked) {
            handleNextStep()
        //   validateAndProceed();
        }
        return () => {
          // Cleanup: Reset `nextClicked` to false after the effect runs to avoid repetitive calls
          setNextClicked(false);
        };
      }, [nextClicked]);
    return (
        <div className='animate-fade-in-up'>
            {/* <div className='transition ease-in-out delay-150 duration-300 translate-y-1 scale-110'></div> */}
             {/* {width < 1024 ? (
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
                )} */}
                   {/* <StaffModalHeader
                        title="Add Staff Member"
                        handleGoForwardStep={handleGoForwardStep}
                        handleGoBack={handlePreviousStep}
                    >
                    </StaffModalHeader> */}
                    
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
