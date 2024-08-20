import { Fragment, useState,useContext,useEffect } from "react"
import { useFormStep } from "@/app/hooks/useFormStep"
import { StaffModalHeader } from "../../header"
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { useKitchen } from "@/app/context/KitchenContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { StaffModalFooter } from "../../footer";

export const UserSignCode = () => {
    // const {handleSave, handlePreviousStep } = useFormStep()
    const { handlePreviousStep,handleNextStep } = useFormStep()
    const { state, dispatch,saveStaffToFirebase,resetForm } = useContext(FormContext)!;
    const [passCode, setPassCode] = useState<string[]>(["", "", "", ""]);
    const [error, setError] = useState<boolean>(false);

    const { kitchen } = useKitchen();

  const kitchenId = kitchen?.kitchenId ?? null;
  
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

            // await saveStaffToFirebase();

            // try {
            //     const configDocRef = doc(db, "configs",kitchenId);
            //     const configDoc = await getDoc(configDocRef);
            //     if (configDoc.exists()) {
            //       const currentData = configDoc.data();
            //       const existStaffMembers = currentData?.staffMemberConfigs?.staffMembers || [];
            //       const updatedStaffMembers = [...existStaffMembers, state];

            //       await updateDoc(configDocRef, {
            //         "staffMemberConfigs.staffMembers": updatedStaffMembers,
            //         "staffMemberConfigs.enabled": true,          
            //         "staffMemberConfigs.idleTime": 0,           
            //         "staffMemberConfigs.passcodeEnabled": true
            //     });

            //       console.log("New staff member added successfully!");
            //     } else {
            //       console.log("Config document does not exist!");
            //     }
            //   } catch (error) {
            //     console.error("Error adding new staff member: ", error);
            //   }

            handleNextStep()
            try {
                const configDocRef = doc(db, "configs", kitchenId);
            
                // Retrieve the document and destructure the necessary data
                const configDoc = await getDoc(configDocRef);
                if (!configDoc.exists()) {
                    console.log("Config document does not exist!");
                    return;
                }
            
                const { staffMemberConfigs = {} } = configDoc.data();
                const { staffMembers = [] } = staffMemberConfigs;
            
                // Update the document with the new staff member and other config settings
                await updateDoc(configDocRef, {
                    "staffMemberConfigs.staffMembers": [...staffMembers, state],
                    "staffMemberConfigs.enabled": true,
                    "staffMemberConfigs.idleTime": 0,
                    "staffMemberConfigs.passcodeEnabled": true,
                });
            
                console.log("New staff member added successfully!");
            } catch (error) {
                console.error("Error adding new staff member:", error);
            }
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
            <StaffModalFooter 
                title={'Add Staff Member'}
                handleGoForwardStep={handleGoForwardStep}
                handleGoBack={handlePreviousStep}
            />
        </div>
    )
}