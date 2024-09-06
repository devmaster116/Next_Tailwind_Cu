import { useFormStep } from "@/app/hooks/useFormStep";
import { useContext, useEffect } from "react";
import Form from "../../../components/form";
import { ImageUpload } from "../../../components/form/ImageUpload";
import { FormContext } from "@/app/context/StaffContext";
export const UserPhoto = () => {
  const { handleNextStep } = useFormStep();
  const { nextClicked, setNextClicked } = useFormStep();
  const { state } = useContext(FormContext)!;

  useEffect(() => {
    if (nextClicked) {
      handleNextStep();
    }
    return () => {
      setNextClicked(false);
    };
  }, [nextClicked]);
  return (
    <div className="animate-fade-in-up ">
      <Form.Header
        title="Add Profile Photo"
        description={`You can add a photo for ${state.firstName} which will appear in the POS and in your admin potal.`}
      />
      <div className="mt-6 flex flex-col ">
        <ImageUpload />
      </div>
    </div>
  );
};
