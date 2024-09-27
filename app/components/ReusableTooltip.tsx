import React from "react";
import { Tooltip } from "react-tooltip"; // Replace with your actual Tooltip library
import { HelpSvg } from "../assets/svg/help";
import { Avatar } from "./base/avatar";

interface TooltipProps {
  id: string;
  title: string;
  description: string;
}

const ReusableTooltip: React.FC<TooltipProps> = ({
  id,
  title,
  description,
}) => {
  return (
    <>
      <Avatar
        icon={
          <>
            <a data-tooltip-id={id} className="truncate">
              <HelpSvg />
            </a>
            <Tooltip
              id={id}
              className="max-w-[320px] !rounded-lg"
              place="bottom"
              positionStrategy="fixed"
            >
              <div>
                <p className="text-white text-xs font-semibold">{title}</p>
                <p className="text-white text-xs font-normal">{description}</p>
              </div>
            </Tooltip>
          </>
        }
      />
    </>
  );
};

export default ReusableTooltip;
