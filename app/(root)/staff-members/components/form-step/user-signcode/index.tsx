import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import { Fragment, useState } from "react"
import Form from "../../../components/form";

export const UserSignCode = () => {
    const {handleSave, handlePreviousStep, setStatusModal } = useFormStep()
    const [code, setCode] = useState<string[]>(["", "", "", ""]);
    const [error, setError] = useState<boolean>(false);
  
    const generateCode = (): void => {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString().split('');
      setCode(randomCode);
      setError(false); // Reset error when a code is generated
    };
    const  handleGoForwardStep=()=> {
        handleSave()
      }
    const sendGenerateRequestCode = (): void => {
        if (code.includes("")) {
          setError(true);
        } else {
          setError(false);
          // Proceed with the next step, such as signing in
          console.log('Code is complete:', code.join(''));
        }
      };
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
                    <div className="mt-5 flex flex-col ">
                        <div className="">
                        <h2 className="text-sm font-semibold text-gray-700">Gustons' Sign in Code</h2>
                            <div className=" flex flex-row items-center  bg-white ">
                                {code.map((digit, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 flex items-center justify-center  text-center border   ${error && digit === "" ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    {digit}
                                </div>
                                ))}

                                 <div
                                        onClick={generateCode}
                                        className=" flex text-gray-700 font-semibold rounded-md border-gray-300 "
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
                            // checked
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