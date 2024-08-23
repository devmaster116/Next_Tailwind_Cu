"use client"
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useWindowSize from "@/app/hooks/useWindowSize";

export const  UserInfo=()=> {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const { width } = useWindowSize()
  const [isEditing, setIsEditing] = useState(false);
  const { state, dispatch,resetForm } = useContext(FormContext)!;
  const [loading, setLoading] = useState(false);
  const validateRequired = (value: string) => value?.trim().length > 0;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName: state.firstName || "",
    lastName: state.lastName || "",
    displayName: state.displayName || "",
    email: state.email || "",
    phoneNumber: state.phoneNumber || "",
  });
  
  const { handleNextStep } = useFormStep()
  const handleEnableInputEdit = () => {
       setIsEditing(true);
  }

  const handleCloseModal=() => {
    nextSearchParams.delete('type')
    router.replace(`${pathname}?${nextSearchParams}`)
    // setStatusModal(false)
    resetForm()
  }
  const handleGoForwardStep = async () => {
    console.log("``````000```````")
    // handleNextStep()
    // dispatch({ type: 'SET_USER_INFO', payload: newUser });
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(newUser?.firstName)) {
      newErrors.firstName = "Please enter a valid name.";
    }
    if (!validateRequired(newUser?.lastName)) {
      newErrors.lastName = "Please enter a valid name.";
    }
    if(newUser?.firstName&&newUser?.lastName){
      newUser.displayName=newUser?.firstName+" "+newUser?.lastName.charAt(0)
    }
    if (
      !validateRequired(newUser?.email) ||
      !validateEmail(newUser?.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (
      !validateRequired(newUser?.phoneNumber) ||
      !validateMobileNumber(newUser?.phoneNumber)
    ) {
      newErrors.phoneNumber =
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
      {width < 1024 ? (
        <StaffModalHeader 
          title={"Add Staff Member"}
          handleGoForwardStep={handleGoForwardStep}
          handleClose={handleCloseModal}
        >
          <Form.StepStatus stepIndex={1} ></Form.StepStatus>
        </StaffModalHeader>
      ) : (
        <>
          <StaffModalHeader 
            title={"Add Staff Member"}
            handleGoForwardStep={handleGoForwardStep}
            handleClose={handleCloseModal}
          />
          <Form.StepStatus stepIndex={1}></Form.StepStatus>
        </>
      )}
    
      <Form.Header
            title="Profile"
            description="Add your staff members name,nickname, email addres and mobile number."
        />
        <form className="mt-8">
              <div className="flex flex-col lg:flex-row justify-between  gap-6 mb-6 lg:mb-7">
              <div className=" w-full">
                  <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">First Name</p>
                    <Input
                      value={newUser.firstName}
                      handleInputChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      // handleInputChange={(e) =>
                      //   handleInputChangeField(e, setNewUser, setErrors, "firstName")
                      // }
                      // handleBlurField={(e) =>
                      //   handleBlurField(
                      //     e,
                      //     setNewUser,
                      //     setErrors,
                      //     validateRequired,
                      //     "Please enter a valid first name.",
                      //     "firstName"
                      //   )
                      // }
                      error={errors.firstName}
                      loading={loading}
                      placeholder="Enter first name"
                      inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                    />
              </div>
              <div className="w-full">
            
                  <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">Last Name</p>
                  <Input
                    value={newUser.lastName}
                    handleInputChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    // handleInputChange={(e) =>
                    //   handleInputChangeField(e, setNewUser, setErrors, "lastName")
                    // }
                    // handleBlurField={(e) =>
                    //   handleBlurField(
                    //     e,
                    //     setNewUser,
                    //     setErrors,
                    //     validateRequired,
                    //     "Please enter a valid last name.",
                    //     "lastName"
                    //   )
                    // }
                    error={errors.lastName}
                    loading={loading}
                    placeholder="Enter last name"
                    inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                  />
              </div>
            
              </div>
              
            <div className="flex flex-col mb-6 lg:mb-7 gap-1">
              <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">Nick Name (Display Name)</p>
              <div className="flex flex-row w-full" style={{ boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' }}>
                <div className="flex-grow flex flex-col h-[44px] lg:h-[48px]">
                  <input
                    type="text"
                    className="bg-gray-50 rounded-l-xl px-[14px] py-[10px] border border-gray-300 w-full h-full text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-normal text-gray-900 placeholder-gray-500" style={{ boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' }}
                    value={newUser.displayName || 
                      (newUser.firstName && newUser.lastName ? 
                      `${newUser.firstName} ${newUser.lastName.charAt(0)}` : '')}
                    placeholder="Default display name"
                     disabled={!isEditing}
                    onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  />
                </div>

                <div className="flex cursor-pointer items-center justify-center px-[18px] py-[10px] border border-gray-300 h-[44px] lg:h-[48px] w-[64px] lg:w-[68px] rounded-r-xl"
                onClick={handleEnableInputEdit}
                >
                  <p className="text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700">Edit</p>
                </div>
              </div>
                <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]  font-normal text-grey-600">If not set default is first name and last name initial</p>
            </div>
            <div className="flex flex-col mb-6 lg:mb-7 gap-1">
              <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">Email Address</p>
              <Input
                value={newUser.email}
                handleInputChange={(e) => setNewUser({...newUser, email: e.target.value})}
                // handleInputChange={(e) =>
                //   handleInputChangeField(
                //     e,
                //     setNewUser,
                //     setErrors,
                //     "email"
                //   )
                // }
                // handleBlurField={(e) =>
                //   handleBlurField(
                //     e,
                //     setNewUser,
                //     setErrors,
                //     validateRequired,
                //     "Please enter a valid email address.",
                //     "email"
                //   )
                // }
                inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                error={errors.email}
                loading={loading}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">Mobile Number</p>
              <Input
                value={newUser.phoneNumber}
                maxLength={10}
                type="number"
                handleInputChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                // handleInputChange={(e) =>
                //   handleInputChangeField(
                //     e,
                //     setNewUser,
                //     setErrors,
                //     "phoneNumber"
                //   )
                // }
                // handleBlurField={(e) =>
                //   handleBlurField(
                //     e,
                //     setNewUser,
                //     setErrors,
                //     validateRequired,
                //     "Please enter a valid mobile number.",
                //     "phoneNumber"
                //   )
                // }
                error={errors.phoneNumber}
                loading={loading}
                placeholder="Enter mobile number"
                inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
              />
            </div>
            {errors?.addingUser && (
              <p className="">{errors.addingUser}</p>
            )}
        </form>
      <StaffModalFooter 
        title={ "Add Staff Member"}
        handleGoForwardStep={handleGoForwardStep}
        handleClose={handleCloseModal}
      />

        {/* <StaffModalFullPage
            show={statusModal}
            content={
              <div className={styles.formContainer}>
                   <FormStep/>
            </div>
            }
          /> */}
    </div>
  )
} 
