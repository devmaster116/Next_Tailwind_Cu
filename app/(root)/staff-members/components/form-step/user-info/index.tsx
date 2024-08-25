"use client"
import React, { useEffect, useState,useContext } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { FormContext, FormContextType } from "@/app/context/StaffContext";
import { StaffModalHeader } from "../../header";
import { StaffModalFooter } from "../../footer";
import Input from "@/app/components/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  handleBlurField,
  handleInputChangeField,
  validateEmail,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";
type Props = {
  key: number
}

export const UserInfo = ({key}:Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  // const nextSearchParams = new URLSearchParams(searchParams.toString());
  const typeParam = searchParams.get("type");
  const validateRequired = (value: string) => value?.trim().length > 0;
  const [isEditing, setIsEditing] = useState(false);
  const { state, resetForm, dispatch ,currentStaff} = useContext(FormContext)!

  const { nextClicked, setNextClicked } = useFormStep();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName:  "",
    lastName:  "",
    displayName:  "",
    email:  "",
    phoneNumber:  "",
  });
  // Update newUser state when the modal is opened or the state in context changes
  useEffect(() => {
    setNewUser({
      firstName: state.firstName || "",
      lastName: state.lastName || "",
      displayName: state.displayName || "",
      email: state.email || "",
      phoneNumber: state.phoneNumber || "",
    });
  }, [state]);
 
  useEffect(() => {
    if (nextClicked) {
      validateAndProceed();
    }
    return () => {
      setNextClicked(false);
    };
  }, [nextClicked]);

  const { handleNextStep } = useFormStep();

  const handleEnableInputEdit = () => {
    setIsEditing(true);
  };

  const validateAndProceed = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      handleNextStep();
      dispatch({ type: "SET_USER_INFO", payload: newUser });
    }
  };

  const validateFields = (): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    if (!validateRequired(newUser?.firstName)) {
      newErrors.firstName = "Please enter a valid name.";
    }
    if (!validateRequired(newUser?.lastName)) {
      newErrors.lastName = "Please enter a valid name.";
    }
    if (newUser?.firstName && newUser?.lastName) {
      newUser.displayName = `${newUser?.firstName} ${newUser?.lastName.charAt(0)}`;
    }
    if (!validateEmail(newUser?.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validateMobileNumber(newUser?.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid mobile number containing 10 digits.";
    }

    return newErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUser((prevUser) => ({ ...prevUser, [field]: value }));
    const newErrors = validateFields();
    setErrors(newErrors);
  };
  return (
    <div key={key}>
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
                      handleInputChange={(e) => handleInputChange("firstName", e.target.value)}
                      // handleInputChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      error={errors.firstName}
                      loading={loading}
                      // onBlur={() => handleBlurField("firstName")}
                      placeholder="Enter first name"
                      inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                    />
              </div>
              <div className="w-full">
            
                  <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">Last Name</p>
                  <Input
                    value={newUser.lastName}
                    handleInputChange={(e) => handleInputChange("lastName", e.target.value)}
                    // handleInputChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
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
                     onChange={(e) => handleInputChange("displayName", e.target.value)}
                    // onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
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
                handleInputChange={(e) => handleInputChange("email", e.target.value)}
                // handleInputChange={(e) => setNewUser({...newUser, email: e.target.value})}
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
                handleInputChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                // handleInputChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
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
      {/* <StaffModalFooter 
        title={ "Add Staff Member"}
        handleGoForwardStep={validateAndProceed}
        handleClose={handleCloseModal}
      /> */}
    </div>
  )
} 
