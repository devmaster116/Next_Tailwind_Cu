import Input from "@/app/components/Input";
import { useState } from "react";

export const EditTyroLocationId = () => {

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusAddEditBtn, setStatusAddEditBtn] = useState<{ [key: string]: string }>({});
  return (
        <div className="w-full">
              <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
             To enable your Swifti online store front you need to have a Tyro-e-Commerce location ID.
              </p>
              <div className="mt-5 lg:mt-8">
                  <div className="flex flex-col mb-6 lg:mb-7 gap-1">
                        <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
                          e-Commerce location ID
                        </p>
                        <Input
                          value={'123123'}
                          type="number"
                          maxLength={10}
                          // handleInputChange={e =>
                          //   handleInputChange("phoneNumber", e.target.value)
                          // }
                          error={errors.phoneNumber}
                          placeholder="Enter mobile number"
                          inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
                        />
                  </div>
              </div>

        </div>
  );
};
