import React, { useState } from "react";
import styles from "./Overview.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatReadableDate } from "./utils/formatDate";

interface DatePickerModalProps {
  setIsReportVisible: (value: boolean) => void;
  reportStartDate: Date;
  setReportStartDate: (date: Date) => void;
  reportEndDate: Date;
  setReportEndDate: (date: Date) => void;
  setCustomDate: (date: string) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
}

const DatePickerModal = ({
  setIsReportVisible,
  reportStartDate,
  setReportStartDate,
  reportEndDate,
  setReportEndDate,
  setCustomDate,
  selectedOption,
  setSelectedOption,
  isAnimating,
  setIsAnimating,
}: DatePickerModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleApplyClick = () => {
    if (startDate) {
      const finalEndDate = endDate || startDate;

      setReportStartDate(startDate);
      setReportEndDate(finalEndDate);

      setSelectedOption("Custom");
      hideModal();
    }

    if (selectedOption === "Custom") {
      setCustomDate(
        `${formatReadableDate(reportStartDate)} - ${formatReadableDate(
          reportEndDate
        )}`
      );
    }
  };

  const handleCancelClick = () => {
    setIsReportVisible(true);
  };

  const hideModal = () => {
    setIsAnimating(false);
  };

  return (
    <div
      className={`${styles.datePickerModal} ${
        isAnimating ? styles.show : styles.hide
      }`}
    >
      <div className={styles.modalContentDatePicker}>
        <div className="customDatePickerWrapper">
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            calendarStartDay={1}
          />
          <div className={styles.dateConfirmation}>
            <button className={styles.cancel} onClick={handleCancelClick}>
              Cancel
            </button>
            <button className={styles.apply} onClick={handleApplyClick}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
