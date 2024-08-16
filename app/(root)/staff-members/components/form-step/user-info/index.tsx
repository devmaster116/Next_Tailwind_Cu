import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { useForm } from "@/app/hooks/useForm";
import { ACTIONS } from "@/app/context/StaffForm";
import { TextInput } from "../../form/TextInput";
import { StaffModalHeader } from "../../header";
import withAuth from "@/app/components/Auth/withAuth";
import Input from "@/app/components/Input";

import {
  handleBlurField,
  handleInputChangeField,
  validateEmail,
  formatDate,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";


export const  UserInfo=()=> {

  const [loading, setLoading] = useState(false);
  const validateRequired = (value: string) => value?.trim().length > 0;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName: "",
    lastName: "",
    displayName: "",
    emailAddress: "",
    mobileNumber: "",
  });
  
  const { handleNextStep, setStatusModal } = useFormStep()


  const handleGoForwardStep = async () => {
    handleNextStep()
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(newUser?.firstName)) {
      newErrors.firstName = "Please enter a valid name.";
    }
    if (!validateRequired(newUser?.lastName)) {
      newErrors.lastName = "Please enter a valid name.";
    }
    if (
      !validateRequired(newUser?.emailAddress) ||
      !validateEmail(newUser?.emailAddress)
    ) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }
    if (
      !validateRequired(newUser?.mobileNumber) ||
      !validateMobileNumber(newUser?.mobileNumber)
    ) {
      newErrors.mobileNumber =
        "Enter a valid mobile number containing 10 digits.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // handleNextStep()
    }
  };

  return (
    <div>
      <StaffModalHeader 
        title={'Add Staff Member'}
        handleGoForwardStep={handleGoForwardStep}
        handleClose={() => setStatusModal(false)}
      />
      <Fragment>
        {/* <Form.StepStatus stepIndex={1}></Form.StepStatus> */}
          <Form.Header
            title="Profile"
            description="Add your staff members name,nickname, email addres and mobile number."
          />
            
             <form className="mt-8">
                   <div className="flex flex-col lg:flex-row justify-between gap-6 mb-7">
                    <div className="flex flex-col">
                        <p className="">First Name</p>
                          <Input
                            value={newUser.firstName}
                            handleInputChange={(e) =>
                              handleInputChangeField(e, setNewUser, setErrors, "firstName")
                            }
                            handleBlurField={(e) =>
                              handleBlurField(
                                e,
                                setNewUser,
                                setErrors,
                                validateRequired,
                                "Please enter a valid first name.",
                                "firstName"
                              )
                            }
                            error={errors.firstName}
                            loading={loading}
                            placeholder="Enter first name"
                          />
                    </div>
                    <div className="flex flex-col ">
                        <p className="">Last Name</p>
                        <Input
                          value={newUser.lastName}
                          handleInputChange={(e) =>
                            handleInputChangeField(e, setNewUser, setErrors, "lastName")
                          }
                          handleBlurField={(e) =>
                            handleBlurField(
                              e,
                              setNewUser,
                              setErrors,
                              validateRequired,
                              "Please enter a valid last name.",
                              "lastName"
                            )
                          }
                          error={errors.lastName}
                          loading={loading}
                          placeholder="Enter last name"
                        />
                    </div>
                  
                    </div>
                   
                  <div className="flex flex-col mb-6 gap-1">
                    <p className="font-semibold text-base text-gray-700">Nick Name(Display Name)</p>
                    <Input
                      value={newUser.displayName}
                      handleInputChange={(e) =>
                        handleInputChangeField(e, setNewUser, setErrors, "displayName")
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid first name.",
                          "displayName"
                        )
                      }
                      error={errors.displayName}
                      loading={loading}
                      placeholder="Default display name"
                    />
                     <p className="text-base font-normal text-grey-600">If not set default is first name and last name initial</p>
                  </div>
                  <div className="flex flex-col mb-6 gap-1">
                    <p className="font-semibold text-base text-gray-700">Email Address</p>
                    <Input
                      value={newUser.emailAddress}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setNewUser,
                          setErrors,
                          "emailAddress"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid email address.",
                          "emailAddress"
                        )
                      }
                      error={errors.emailAddress}
                      loading={loading}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base text-gray-700">Mobile Number</p>
                    <Input
                      value={newUser.mobileNumber}
                      maxLength={10}
                      type="number"
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setNewUser,
                          setErrors,
                          "mobileNumber"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid email address.",
                          "mobileNumber"
                        )
                      }
                      error={errors.mobileNumber}
                      loading={loading}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  {errors?.addingUser && (
                    <p className="">{errors.addingUser}</p>
                  )}
                </form>
      </Fragment>
    </div>
  )
} 
