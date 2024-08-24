import { useFormStep } from "@/app/hooks/useFormStep";
import { UserInfo } from "./user-info";
import { UserPhoto } from "./user-photo";
import { UserRole } from "./user-role";
import { UserSignCode } from "./user-signcode";

const steps = [
  {
    step: 1,
    component: <UserInfo />
  },
  {
    step: 2,
    component: <UserPhoto />
  },
  {
    step: 3,
    component: <UserRole />
  },
  {
    step: 4,
    component: <UserSignCode />
  }
]

export function FormStep() {
  const { currentStep } = useFormStep();
  return (
    <div className="flex flex-col flex-1 justify-between">
      {steps[currentStep - 1].component ?? steps[0].component}
    </div>
  )
} 