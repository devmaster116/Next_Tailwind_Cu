import React from "react";

interface CancelSvgProps extends React.SVGProps<SVGSVGElement> {
  width: number;
  height: number;
  color: string;
}

export const CancelSvg: React.FC<CancelSvgProps> = ({
  width,
  height,
  color,
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M13 1L1 13M1 1L13 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
