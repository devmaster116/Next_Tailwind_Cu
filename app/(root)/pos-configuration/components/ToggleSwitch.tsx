import React from "react";

interface ToggleSwitchProps {
  isToggled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isToggled, onToggle }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isToggled}
        onChange={onToggle}
      />
      <div
        className={`relative w-11 lg:w-14 h-6 lg:h-7 rounded-full p-[2px] ${
          isToggled ? "bg-green-500" : "bg-gray-100"
        }  transition-colors`}
      >
        <div
          className={` bg-white rounded-full lg:h-6 h-5 lg:w-6 w-5 transition-all ${
            isToggled ? "translate-x-full" : ""
          } `}
          style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
