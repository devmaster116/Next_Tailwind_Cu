import { Fragment } from "react";
import React, { useEffect, useState,useContext } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { FormContext } from "@/app/context/StaffContext";
import { StaffModalHeader } from "../../header";
import { StaffModalFooter } from "../../footer";
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
  const { state, dispatch,resetForm } = useContext(FormContext)!;

  const [loading, setLoading] = useState(false);
  const validateRequired = (value: string) => value?.trim().length > 0;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName: state.firstName || "",
    lastName: state.lastName || "",
    displayName: state.displayName || "",
    email: state.email || "",
    mobileNumber: state.phoneNumber || "",
  });
  
  const { handleNextStep, setStatusModal } = useFormStep()

  const handleCloseModal=() => {
    setStatusModal(false)
    resetForm()
  }
  const handleGoForwardStep = async () => {
    // handleNextStep()
    // dispatch({ type: 'SET_USER_INFO', payload: newUser });
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(newUser?.firstName)) {
      newErrors.firstName = "Please enter a valid name.";
    }
    if (!validateRequired(newUser?.lastName)) {
      newErrors.lastName = "Please enter a valid name.";
    }
    if (
      !validateRequired(newUser?.email) ||
      !validateEmail(newUser?.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
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
      handleNextStep()
      dispatch({ type: 'SET_USER_INFO', payload: newUser });
    }
  };

  return (
    <div>
      <StaffModalHeader 
        title={'Add Staff Member'}
        handleGoForwardStep={handleGoForwardStep}
        handleClose={handleCloseModal}
      />
      <Fragment>
        <Form.StepStatus stepIndex={1}></Form.StepStatus>
          <Form.Header
            title="Profile"
            description="Add your staff members name,nickname, email addres and mobile number."
          />
            
             <form className="mt-8">
                   <div className="flex flex-col lg:flex-row justify-between gap-6 mb-7">
                    <div className="flex flex-col">
                        <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold text-gray-700">First Name</p>
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
                  
                        <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold text-gray-700">Last Name</p>
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
                    <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold text-gray-700">Nick Name(Display Name)</p>
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
                    <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold text-gray-700">Email Address</p>
                    <Input
                      value={newUser.email}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setNewUser,
                          setErrors,
                          "email"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid email address.",
                          "email"
                        )
                      }
                      error={errors.email}
                      loading={loading}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-semibold text-gray-700">Mobile Number</p>
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
      <StaffModalFooter 
        title={'Add Staff Member'}
        handleGoForwardStep={handleGoForwardStep}
        handleClose={handleCloseModal}
      />
    </div>
  )
} 
