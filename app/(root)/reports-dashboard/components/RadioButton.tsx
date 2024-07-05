import React, { ChangeEvent } from "react";
import styles from "./RadioButton.module.scss";

interface RadioButtonProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  checked,
  onChange,
}) => {
  return (
    <div className={styles.selectDateButton}>
      <label>
        <input
          type="radio"
          name="options"
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
