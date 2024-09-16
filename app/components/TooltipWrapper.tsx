import React from "react";

interface TooltipWrapperProps {
  children: React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg pt-2 pl-2 pr-2 pb-1 shadow-lg text-sm w">
      {children}
    </div>
  );
};

export default TooltipWrapper;
