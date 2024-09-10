import { twMerge } from "tailwind-merge";
import { Typography } from "../typography";

type ClassOverrideProps = {
  container?: string;
  label?: string;
  icon?: string;
};

type Props = {
  icon: JSX.Element;
  label?: string;
  classOverride?: ClassOverrideProps;
  onClick?: () => void;
};

export const Avatar = (props: Props) => {
  return (
    <div
      className={twMerge(
        "flex items-center gap-2",
        props?.classOverride?.container
      )}
    >
      <div
        className={twMerge(
          "flex justify-center items-center cursor-pointer w-6 h-6",
          props?.classOverride?.icon
        )}
        onClick={props?.onClick}
      >
        {props.icon}
      </div>

      {props?.label && (
        <Typography
          variant="label-medium"
          className={props?.classOverride?.label}
        >
          {props.label}
        </Typography>
      )}
    </div>
  );
};
