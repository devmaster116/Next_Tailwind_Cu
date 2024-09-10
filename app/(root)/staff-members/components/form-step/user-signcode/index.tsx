import { useState, useContext, useEffect } from "react";
import { useFormStep } from "@/app/hooks/useFormStep";
import Form from "../../../components/form";
import { FormContext } from "@/app/context/StaffContext";
import { useKitchen } from "@/app/context/KitchenContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const UserSignCode = () => {
  const { currentStep, setCurrentStep, setStatusAddStaff } = useFormStep();
  const { state, dispatch, resetForm } = useContext(FormContext)!;
  const [passCode, setPassCode] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<boolean>(false);
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const { nextClicked, setNextClicked } = useFormStep();

  const generateCode = (): void => {
    const randomCode = Math.floor(1000 + Math.random() * 9000)
      .toString()
      .split("");
    setPassCode(randomCode);
    dispatch({ type: "SET_PASSCODE", payload: randomCode.join("") });
    setError(false);
  };

  useEffect(() => {
    if (state.passcode) {
      setPassCode(state.passcode.split(""));
    }
  }, [state.passcode]);

  useEffect(() => {
    if (nextClicked) {
      handleGoForwardStep();
    }
    return () => {
      setNextClicked(false);
    };
  }, [nextClicked]);

  const handleGoForwardStep = async () => {
    if (passCode.includes("")) {
      setError(true);
    } else {
      setError(false);
      setStatusAddStaff(true); //
      nextSearchParams.delete("type");
      router.replace(`${pathname}?${nextSearchParams}`);

      try {
        if (!kitchenId) {
          console.error("Kitchen ID is required but was not provided.");
          return;
        }
        const configDocRef = doc(db, "configs", kitchenId);
        const configDoc = await getDoc(configDocRef);
        if (!configDoc.exists()) {
          console.log("Config document does not exist!");
          return;
        }

        const { staffMemberConfigs = {} } = configDoc.data();
        const { staffMembers = [] } = staffMemberConfigs;
        await updateDoc(configDocRef, {
          staffMemberConfigs: {
            ...staffMemberConfigs,
            enabled: true,
            idleTime: 0,
            passcodeEnabled: true,
            staffMembers: [...staffMembers, { ...state, id: uuidv4() }],
          },
        });
     
        setCurrentStep(1);
        resetForm();
        console.log("New staff member added successfully!");
      } catch (error) {
        console.error("Error adding new staff member:", error);
      }
    }
  };

  useEffect(() => {
    if (currentStep > 4) {
      handleGoForwardStep();
    }
  }, [currentStep]);

  return (
    <div className="">
      <Form.Header
        title="Generate Code"
        description={`This code will be used by ${state.firstName} to sign in to POS.`}
      />
      <div className="mt-6 lg:[mt-8] flex flex-col ">
        <div className="flex flex-col">
          <h2 className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            Sign in Code
          </h2>

          <div className="flex flex-row  w-full lg:w-2/3  my-[6px]">
            {passCode.map((digit, index) => (
              <div
                key={index}
                className={`relative flex py-[6px] w-[52px] h-[43px] lg:h-[48px] lg:w-[52px] items-center justify-center text-center border 
                    ${
                      error && digit === ""
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${index == 0 ? "rounded-s-lg" : ""}`}
              >
                {error || digit === "" ? (
                  <div className="absolute bottom-[12px] left-1/2 transform -translate-x-1/2 bg-gray-300 h-[2px] w-[15px] lg:w-[19px]"></div>
                ) : (
                  <p className="text-[24px] leading-[32px] lg:text-[30px] lg:leading-[36px] font-semibold text-gray-600">
                    {digit}
                  </p>
                )}
              </div>
            ))}

            <div
              onClick={generateCode}
              className={`flex flex-1 cursor-pointer h-[43px] lg:h-[48px] items-center rounded-e-lg justify-center  border  px-[18px] py-[10px] ${
                error ? " border-l-red-500" : "border-gray-300"
              }`}
            >
              <p className=" cursor-pointer text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700">
                Generate
              </p>
            </div>
          </div>
          {error && (
            <div className="flex flex-row text-rose-500 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-normal ">
              Generate a code. This code will be used by this{" "}
              {` ${state.firstName}`} to sign in to POS.
            </div>
          )}
        </div>
        <div className="flex items-starter mt-6 lg:[mt-8]">
          <div className="flex flex-col ">
            <input
              type="checkbox"
              className={twMerge(
                "mr-2 h-5 w-5 border  rounded-[6px] checked:border-purple-600 checked:bg-white accent-purple-600"
              )}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row ">
              <p className="text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] font-semibold text-gray-700">
                Send passcode via email to {` ${state.firstName}`}.
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] text-gray-600 font-normal">
                ({`${state.email}`})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
