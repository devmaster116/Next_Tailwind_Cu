"use client";
import React, { useEffect, useState, useContext } from "react";
import Form from "../../../components/form";
import { useFormStep } from "@/app/hooks/useFormStep";
import { FormContext } from "@/app/context/StaffContext";
import Input from "@/app/components/Input";
import Image from "next/image";

import { useRouter } from "next/navigation";
import {
  capitalizeFirstLetter,
  validateEmail,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";
import { useKitchen } from "@/app/context/KitchenContext";
type Props = {
  key: number;
};

export const EditUserInfo = ({ key }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentStaff, updateStaffInFirebase, loadStaffForEdit } =
    useContext(FormContext)!;
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const {
    updateUserInfoClicked,
    setUpdateUserInfoClicked,
    setPageKey,
    pageKey,
  } = useFormStep();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nickFlag, setNickFlag] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
  });
  useEffect(() => {
    if (currentStaff)
      setNewUser({
        firstName: currentStaff.firstName || "",
        lastName: currentStaff.lastName || "",
        displayName: currentStaff.displayName,
        email: currentStaff.email || "",
        phoneNumber: currentStaff.phoneNumber || "",
      });

    if (
      `${currentStaff?.firstName} ${currentStaff?.lastName.charAt(0)}` ==
      currentStaff?.displayName
    ) {
      setNickFlag(true);
    }
  }, [currentStaff]);
  useEffect(() => {
    if (!isEditing) {
      if (nickFlag) {
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
          displayName: prevUser.displayName,
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
  }, [isEditing, newUser.firstName, newUser.lastName]);

  useEffect(() => {
    if (updateUserInfoClicked) {
      validateAndProceed();
    }
    return () => {
      setUpdateUserInfoClicked(false);
    };
  }, [updateUserInfoClicked]);

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
        if (isEditing)
          return value?.trim().length > 0
            ? ""
            : "Please enter a valid nickname.";
        if (!isEditing) return "";
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
    setIsEditing(true);
  };

  const validateAndProceed = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      if (currentStaff) {
        const updatedStaff = {
          ...currentStaff,
          ...newUser,
        };
        try {
          loadStaffForEdit(updatedStaff);
          router.back();
          setPageKey(pageKey + 1);
          await updateStaffInFirebase(updatedStaff, kitchenId);
        } catch (error) {
          console.error("Error updating staff:", error);
        }
      }
    }
  };

  return (
    <div key={key}>
      <Form.Header
        title="Profile"
        description={`Update ${currentStaff?.firstName}'s name, nickname, email address, and mobile number.`}
      />
      <form className="mt-5 lg:mt-8">
        <div className="flex flex-col lg:flex-row justify-between  gap-6 mb-6 lg:mb-7">
          <div className=" w-full">
            <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
              First Name
            </p>
            <Input
              value={newUser.firstName}
              handleInputChange={e =>
                handleInputChange("firstName", capitalizeFirstLetter(e.target.value))
              }
              error={errors.firstName}
              loading={loading}
              placeholder="Enter first name"
              inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
            />
          </div>
          <div className="w-full">
            <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
              Last Name
            </p>
            <Input
              value={newUser.lastName}
              handleInputChange={e =>
                handleInputChange("lastName", capitalizeFirstLetter(e.target.value))
              }
              error={errors.lastName}
              loading={loading}
              placeholder="Enter last name"
              inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
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
            <div className="flex-grow relative flex flex-col h-[44px] lg:h-[48px]">
              <input
                type="text"
                className={`${isEditing ? "bg-white" : "bg-gray-50"} border  ${
                  errors.displayName
                    ? "border-red-500"
                    : "border-gray-300 focus:!border-sky-500"
                }  focus:outline-none rounded-l-xl px-[14px] py-[10px]   w-full h-full text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-normal text-gray-900 placeholder-gray-500`}
                style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
                value={
                  isEditing
                    ? newUser.displayName
                    : newUser.displayName
                    ? newUser.displayName
                    : `${newUser.firstName} ${newUser.lastName.charAt(0)}`
                }
                placeholder={`${
                  errors.displayName
                    ? "Enter Nick Name "
                    : "Default display name"
                }`}
                disabled={!isEditing}
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
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
            error={errors.email}
            loading={loading}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Mobile Number (Optional)
          </p>
          <Input
            value={newUser.phoneNumber}
            maxLength={10}
            type="number"
            handleInputChange={e =>
              handleInputChange("phoneNumber", e.target.value)
            }
            error={errors.phoneNumber}
            loading={loading}
            placeholder="Enter mobile number"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>
        {errors?.addingUser && <p className="">{errors.addingUser}</p>}
      </form>
    </div>
  );
};
