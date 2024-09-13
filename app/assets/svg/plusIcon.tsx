import React from "react";

interface PlusIconProps extends React.SVGProps<SVGSVGElement> {
  width: number;
  height: number;
  color: string;
}

export const PlusIcon: React.FC<PlusIconProps> = ({
  width,
  height,
  color,
  ...rest
}) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.99984 1.16667V12.8333M1.1665 7H12.8332"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
