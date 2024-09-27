import { twMerge } from "tailwind-merge";

type ClassOverride = {
  container?: string;
  labelContainer?: string;
  radioStyle?: string;
  innerRadioStyle?: string;
};

type Props = {
  label: string;
  checked: boolean;
  icon?: JSX.Element;
  onChange: () => void;
  classOverride?: ClassOverride;
};

export const CustomRadio = (props: Props) => {
  return (
    <div
      className={twMerge(
        "flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer",
        props?.classOverride?.container,
        props.checked ? "shadow-[inset_0_0_0_2px_rgba(168,85,247)]" : ""
      )}
      onClick={props.onChange}
    >
      <div
        className={twMerge(
          "flex items-center justify-center gap-2",
          props?.classOverride?.labelContainer
        )}
      >
        {props.label}
        {props?.icon}
      </div>
      <div
        className={twMerge(
          "flex justify-center items-center border rounded-full lg:w-6 lg:h-6 w-5 h-5",
          props?.classOverride?.radioStyle,
          props.checked ? "border-purple-600" : "border-gray-300"
        )}
      >
        {props.checked && (
          <div
            className={twMerge(
              "w-3 h-3 rounded-full",
              props?.classOverride?.innerRadioStyle,
              props.checked ? "bg-purple-600" : "bg-white"
            )}
          />
        )}
      </div>
    </div>
  );
};
