import { useFormStep } from "@/app/hooks/useFormStep";
import { Step } from "./Step";

export function Sidebar() {
  const { currentStep, steps } = useFormStep();

  return (
    <div>
        {steps.map(step => {
          return (
            <Step
              key={step.number}
              step={step}
              isActive={step.number === currentStep}
            />
          )
        })}
    </div>
  )
}