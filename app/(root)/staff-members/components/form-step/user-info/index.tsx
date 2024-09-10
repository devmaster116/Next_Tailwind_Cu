"use client";
import React, { useEffect, useState, useContext } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { FormContext } from "@/app/context/StaffContext";
import Input from "@/app/components/Input";
import Image from "next/image";

import {
  validateEmail,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";

type Props = {
  key: number;
};

export const UserInfo = ({ key }: Props) => {
  const { state, dispatch } = useContext(FormContext)!;
  const {
    nextClicked,
    setNextClicked,
    handleNextStep,
    statusAddEditBtn,
    setStatusAddEditBtn,
    statusNickNameFlag,
    setStatusNickNameFlag,
  } = useFormStep();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (state)
      setNewUser({
        firstName: state.firstName || "",
        lastName: state.lastName || "",
        displayName: state.displayName || "",
        email: state.email || "",
        phoneNumber: state.phoneNumber || "",
      });
    if (
      `${state?.firstName} ${state?.lastName.charAt(0)}` == state?.displayName
    ) {
      setStatusNickNameFlag(true);
    }
  }, [state]);
  useEffect(() => {
    if (!statusAddEditBtn) {
      if (statusNickNameFlag) {
        setNewUser(prevUser => ({
          ...prevUser,
          displayName:
            prevUser.firstName && prevUser.lastName
              ? `${prevUser.firstName} ${prevUser.lastName.charAt(0)}`
              : "",
        }));
      } else {
        setNewUser(prevUser => ({
          ...prevUser,
          displayName: prevUser.displayName
            ? prevUser.displayName
            : prevUser.firstName && prevUser.lastName
            ? `${prevUser.firstName} ${prevUser.lastName.charAt(0)}`
            : "",
        }));
      }
    } else {
      setNewUser(prevUser => ({
        ...prevUser,
        displayName:
          prevUser.displayName ||
          (prevUser.firstName && prevUser.lastName
            ? `${prevUser.firstName} ${prevUser.lastName.charAt(0)}`
            : ""),
      }));
    }
  }, [statusAddEditBtn, newUser.firstName, newUser.lastName]);

  useEffect(() => {
    if (nextClicked) {
      validateAndProceed();
    }
    return () => {
      setNextClicked(false);
    };
  }, [nextClicked]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return value?.trim().length > 0 ? "" : "Please enter a valid name.";
      case "email":
        return validateEmail(value)
          ? ""
          : "Please enter a valid email address.";
      case "displayName":
        if (statusAddEditBtn)
          return value?.trim().length > 0
            ? ""
            : "Please enter a valid nickname.";
        if (!statusAddEditBtn) return "";
      case "phoneNumber":
        if (value)
          return validateMobileNumber(value)
            ? ""
            : "Enter a valid mobile number containing 10 digits.";
      default:
        return "";
    }
  };

  const validateFields = (): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(newUser).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUser(prevUser => ({ ...prevUser, [field]: value }));
    const fieldError = validateField(field, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: fieldError,
    }));
  };

  const handleEnableInputEdit = () => {
    setStatusAddEditBtn(true);
  };

  const validateAndProceed = () => {
    if (!statusAddEditBtn) {
      setNewUser(prevUser => ({
        ...prevUser,
        displayName:
          prevUser.displayName ||
          (prevUser.firstName && prevUser.lastName
            ? `${prevUser.firstName} ${prevUser.lastName.charAt(0)}`
            : ""),
      }));
    }
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      handleNextStep();
      dispatch({ type: "SET_USER_INFO", payload: newUser });
    }
  };

  return (
    <div key={key}>
      <Form.Header
        title="Profile"
        description="Add your staff member's name, nickname, email address, and mobile number."
      />
      <form className="mt-5 lg:mt-8">
        <div className="flex flex-col lg:flex-row justify-between  gap-6 mb-6 lg:mb-7">
          <div className="w-full">
            <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
              First Name
            </p>
            <Input
              value={newUser.firstName}
              handleInputChange={e =>
                handleInputChange("firstName", e.target.value)
              }
              error={errors.firstName}
              placeholder="Enter first name"
              inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal"
            />
          </div>
          <div className="w-full">
            <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
              Last Name
            </p>
            <Input
              value={newUser.lastName}
              handleInputChange={e =>
                handleInputChange("lastName", e.target.value)
              }
              error={errors.lastName}
              placeholder="Enter last name"
              inputStyle="  text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal "
            />
          </div>
        </div>

        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Nick Name (Display Name)
          </p>
          <div
            className="flex flex-row w-full"
            style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
          >
            <div className="flex-grow flex flex-col h-[44px] lg:h-[48px]">
              <input
                type="text"
                className={`${
                  statusAddEditBtn ? "bg-white" : "bg-gray-50"
                } border  ${
                  errors.displayName
                    ? "border-red-500"
                    : "border-gray-300 focus:!border-sky-500"
                }  focus:outline-none rounded-l-xl px-[14px] py-[10px]   w-full h-full text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-normal text-gray-900 placeholder-gray-500`}
                style={{
                  boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                }}
                value={
                  newUser.displayName ||
                  (!statusAddEditBtn
                    ? `${newUser.firstName} ${newUser.lastName.charAt(
                        0
                      )}`.trim()
                      ? `${newUser.firstName} ${newUser.lastName.charAt(0)}`
                      : ""
                    : "")
                }
                placeholder={
                  errors.displayName
                    ? "Enter Nick Name"
                    : "Default display name"
                }
                disabled={!statusAddEditBtn}
                onChange={e => handleInputChange("displayName", e.target.value)}
              />
              {errors.displayName && (
                <div className="absolute right-[10px] top-[15px]">
                  <Image
                    src="/icons/error.svg"
                    height={16}
                    width={16}
                    alt="Business Details icon"
                  />
                </div>
              )}
            </div>

            <div
              className="flex cursor-pointer items-center justify-center px-[18px] py-[10px] border border-gray-300 h-[44px] lg:h-[48px] w-[64px] lg:w-[68px] rounded-r-xl"
              onClick={handleEnableInputEdit}
            >
              <p className="text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700">
                Edit
              </p>
            </div>
          </div>
          <p
            className={`${
              errors.displayName ? "text-red-500" : "text-gray-600"
            } text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-normal `}
          >
            {errors.displayName
              ? errors.displayName
              : "If not set, the default will be the first name followed by the initial of the last name."}
          </p>
        </div>

        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Email Address
          </p>
          <Input
            value={newUser.email}
            handleInputChange={e => handleInputChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Mobile Number (Optional)
          </p>
          <Input
            value={newUser.phoneNumber}
            type="number"
            maxLength={10}
            handleInputChange={e =>
              handleInputChange("phoneNumber", e.target.value)
            }
            error={errors.phoneNumber}
            placeholder="Enter mobile number"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>

        {errors?.addingUser && <p className="">{errors.addingUser}</p>}
      </form>
    </div>
  );
};
