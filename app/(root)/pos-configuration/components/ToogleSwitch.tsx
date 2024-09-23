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
        className={`relative w-11 lg:w-14 h-6 lg:h-7 rounded-full ${
          isToggled ? "bg-green-600" : "bg-gray-200"
        } dark:bg-gray-700 transition-colors`}
      >
        <div
          className={`absolute top-0.5 left-1 bg-white border border-gray-300 rounded-full lg:h-6 h-5 lg:w-6 w-5 transition-all ${
            isToggled ? "translate-x-full" : ""
          } dark:border-gray-600`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;