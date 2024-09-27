import Input from "@/app/components/Input";
import { useContext, useEffect, useState } from "react";
import { validateNumber } from "@/app/components/Auth/utils/helper";
import { useKitchen } from "@/app/context/KitchenContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useBanner } from "@/app/context/BannerContext";
import { OnlineOrderConfigContext } from "@/app/context/OnlineOrderConfigContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { addOnlineOrderConfigInFirebase } from "../../../data-fetching";
import { PosConfigContext } from "@/app/context/PosConfigContext";

type Props = {
  key: number;
};

export const AddTyroLocationId = ({ key }: Props) => {
  const [errors, setErrors] = useState<string>("");
  const [tyroLocationId, setTyroLocationId] = useState<string>("");
  const { setAddTyroLocationIdClicked, addTyroLocationIdClicked } = useContext(
    OnlineOrderConfigContext
  )!;
  const { setBannerLabel } = useContext(PosConfigContext)!;
  const { kitchen } = useKitchen();
  const router = useRouter();
  const kitchenId = kitchen?.kitchenId ?? null;
  const searchParams = useSearchParams();

  const { setBanner } = useBanner();

  const FuncUpdateOrderType = async () => {
    if (!kitchenId) return;

    if (!tyroLocationId) {
      setErrors("Please enter an ID to continue");
      return;
    }
    if (!errors && tyroLocationId) {
      if (searchParams?.get("type") === "add-tyro-location-id") {
        setBannerLabel("Online Ordering has been setup.");
        router.back();
        setTyroLocationId("");
        await addOnlineOrderConfigInFirebase(tyroLocationId, kitchenId);
        setBanner(true);
      }
    }
  };
  useEffect(() => {
    if (addTyroLocationIdClicked) {
      FuncUpdateOrderType();
    }
    return () => {
      setAddTyroLocationIdClicked(false);
    };
  }, [addTyroLocationIdClicked]);

  const handleInputChange = (value: string) => {
    if (!value) {
      setErrors("Please enter an ID to continue");
    } else if (!validateNumber(value)) {
      setErrors("Invalid ID format. Please enter a valid number.");
    } else {
      setErrors(""); // Clear the error if valid
    }
    setTyroLocationId(value); // Update the input value
  };

  return (
    <div className="w-full" key={key}>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        To enable your Swifti online store front you need to have a
        Tyro-e-Commerce location ID.
      </p>
      <div className="mt-5 lg:mt-8">
        <div className="flex flex-col mb-6 lg:mb-7 gap-1">
          <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-semibold text-gray-700">
            e-Commerce location ID
          </p>
          <Input
            value={tyroLocationId}
            type="number"
            maxLength={30}
            handleInputChange={(e) => handleInputChange(e.target.value)}
            error={errors}
            placeholder="Enter your location ID"
            inputStyle="text-[1rem] lg:!text-[1.125rem] leading-[24] lg:!leading-[28] text-gray-900 font-normal placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
};
