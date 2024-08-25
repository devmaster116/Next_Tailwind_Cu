import { twMerge } from "tailwind-merge";

type ClassOverride = {
  container?: string;
  labelContainer?: string;
  radioStyle?: string;
  innerRadioStyle?: string;
};

type Props = {
  label: string;
  checked: boolean; // Added checked prop
  icon?: JSX.Element;
  onChange: () => void;
  classOverride?: ClassOverride;
};

export const CustomRadio = (props: Props) => {
  return (
    <div
      className={twMerge(
        "flex justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer",
        props?.classOverride?.container,
        props.checked ? "border-purple-700" : "" // Conditional styling for checked state
      )}
      onClick={props.onChange} // Handle click event
    >
      <div
        className={twMerge(
          "flex items-center gap-2",
          props?.classOverride?.labelContainer
        )}
      >
        {props.label}
        {props?.icon}
      </div>
      <div
        className={twMerge(
          "flex justify-center items-center border rounded-full w-5 h-5",
          props?.classOverride?.radioStyle,
          props.checked ? "border-purple-700" : "border-gray-300" // Apply styling based on checked state
        )}
      >
        {props.checked && ( // Conditionally render the inner circle when checked
          <div
            className={twMerge(
              "w-3 h-3 rounded-full",
              props?.classOverride?.innerRadioStyle,
              props.checked ? "bg-purple-700" : "bg-white"
            )}
          />
        )}
      </div>
    </div>
  );
};