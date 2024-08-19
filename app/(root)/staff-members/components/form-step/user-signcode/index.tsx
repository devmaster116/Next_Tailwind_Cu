import { Fragment, useState,useContext,useEffect } from "react"
import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";

export const UserSignCode = () => {
    // const {handleSave, handlePreviousStep } = useFormStep()
    const { handlePreviousStep,handleNextStep } = useFormStep()
    const { state, dispatch,saveStaffToFirebase,resetForm } = useContext(FormContext)!;
    const [passCode, setPassCode] = useState<string[]>(["", "", "", ""]);
    const [error, setError] = useState<boolean>(false);

    const generateCode = (): void => {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString().split('');
      setPassCode(randomCode);
      dispatch({ type: 'SET_PASSCODE', payload: randomCode.join('') });
      setError(false); 
    };
    useEffect(() => {
        if (state.passcode) {
            setPassCode(state.passcode.split(''));
        }
    }, [state.passcode]);
    const  handleGoForwardStep = async()=> {
        if (passCode.includes("")) {
            setError(true);
          } else {
            
            setError(false);
            await saveStaffToFirebase();
            // handleSave()
            handleNextStep()
            resetForm()
          }
      }

    return (
        <div>
            <StaffModalHeader 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
            <Fragment>
                  <Form.StepStatus  stepIndex={4}></Form.StepStatus>
                    <Form.Header
                        title="Generate Code"
                        description="This code will be used by Aifanso to sign in to POS."
                    />
                    <div className="mt-5 flex flex-col ">
                        <div className="">
                        <h2 className="text-sm font-semibold text-gray-700">Gustons' Sign in Code</h2>
                            <div className=" flex flex-row items-center  bg-white ">
                                {passCode.map((digit, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 flex items-center justify-center  text-center border   ${error && digit === "" ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    {digit}
                                </div>
                                ))}

                                 <div
                                        onClick={generateCode}
                                        className="text-gray-700 font-semibold rounded-md border-gray-300 "
                                    >
                                        Generate
                                </div>
                            </div>

                            {error && (
                                <div className="flex flex-row text-sm text-red-500 font-normal ">
                             Generate a code. This code will be used by this staff to sign in to POS.
                                </div>
                            )}
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                            type="checkbox"
                            className="mr-2 form-checkbox h-5 w-5 text-primary-600"
                            readOnly
                            />
                            <span className="text-sm font-semibold text-gray-700">Send passcode via email to Guston.</span>
                        </div>
                        <p className="text-base text-gray-600 font-normal">(guston.james@gmail.com)</p>
                    </div>
            </Fragment>
        </div>
    )
}