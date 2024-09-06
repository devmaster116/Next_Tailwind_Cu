import { useContext } from "react";
import { FormStepContext } from "../context/StaffFormStep";

export const useFormStep = () => {
  const context = useContext(FormStepContext);

  if (!context) {
    throw new Error("useFormStep must be used within a FormStepProvider");
  }

  return context;
};
