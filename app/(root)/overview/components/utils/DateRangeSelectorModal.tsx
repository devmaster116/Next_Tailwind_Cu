import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "../Overview.module.scss";
import Image from "next/image";
import RadioButton from "../RadioButton";
import {
  getCurrentMonthRange,
  getCurrentWeekRange,
  getYesterdayDate,
} from "./formatDate";
import DatePickerModal from "../DatePickerModal";

interface DateRangeSelectorModalProps {
  reportStartDate: Date;
  setReportStartDate: (date: Date) => void;
  reportEndDate: Date;
  setReportEndDate: (date: Date) => void;
  customDate: string | undefined;
  setCustomDate: (date: string) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export enum DateRangeOptions {
  Today = "Today",
  Yesterday = "Yesterday",
  ThisWeek = "This Week",
  ThisMonth = "This Month",
  Custom = "Custom",
}

const DateRangeSelectorModal = ({
  selectedOption,
  reportStartDate,
  setReportStartDate,
  reportEndDate,
  setReportEndDate,
  setSelectedOption,
  customDate,
  setCustomDate,
}: DateRangeSelectorModalProps) => {
  const [isReportVisible, setIsReportVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dateRangeOptions = [
    { value: DateRangeOptions.Today, label: DateRangeOptions.Today },
    { value: DateRangeOptions.Yesterday, label: DateRangeOptions.Yesterday },
    { value: DateRangeOptions.ThisWeek, label: DateRangeOptions.ThisWeek },
    { value: DateRangeOptions.ThisMonth, label: DateRangeOptions.ThisMonth },
    { value: DateRangeOptions.Custom, label: DateRangeOptions.Custom },
  ];

  useEffect(() => {
    if (!isAnimating && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, isVisible]);

  const hideModal = () => {
    setIsAnimating(false);
  };

  const showModal = () => {
    setIsVisible(true);
    setIsReportVisible(true);
    setTimeout(() => setIsAnimating(true), 0);
  };

  function setReportDates(startDate: Date, endDate: Date): void {
    setReportStartDate(startDate);
    setReportEndDate(endDate);
    hideModal();
  }

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    switch (value) {
      case DateRangeOptions.Today:
        const today = new Date();
        setReportDates(today, today);
        setSelectedOption(value);
        break;
      case DateRangeOptions.Yesterday:
        const yesterday = getYesterdayDate();
        setReportDates(yesterday, yesterday);
        setSelectedOption(value);
        break;
      case DateRangeOptions.ThisWeek:
        const { startDate, endDate } = getCurrentWeekRange();
        setReportDates(startDate, endDate);
        setSelectedOption(value);
        break;
      case DateRangeOptions.ThisMonth:
        const { startMonthDate, endMonthDate } = getCurrentMonthRange();
        setReportDates(startMonthDate, endMonthDate);
        setSelectedOption(value);
        break;
      case DateRangeOptions.Custom:
        setIsReportVisible(false);
        break;
      default:
        console.log("No valid option selected");
    }
  };

  return (
    <>
      <div className={styles.timeSelector}>
        <button onClick={showModal}>
          <Image
            src="/icons/calendar.svg"
            alt="Calendar Icon"
            width={18}
            height={20}
            className={styles.calendarSvg}
          />
          {customDate ? customDate : selectedOption}
        </button>
      </div>
      {isVisible &&
        (isReportVisible ? (
          <div
            className={`${styles.timeSelectorModal} ${
              isAnimating ? styles.show : styles.hide
            }`}
          >
            <div className={styles.modalContentReports}>
              <div className={styles.modalContentHeader}>
                <div className={styles.calendarSvg}>
                  <Image
                    src="/icons/calendar.svg"
                    alt="Calendar Icon"
                    width={18}
                    height={20}
                  />
                </div>
                <span className={styles.closeButton} onClick={hideModal}>
                  &times;
                </span>
              </div>
              <div className={styles.heading}>Select report date</div>
              <div className={styles.selectDateButtons}>
                {dateRangeOptions.map(option => (
                  <RadioButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    checked={
                      option.value !== DateRangeOptions.Custom &&
                      selectedOption === option.value
                    }
                    onChange={handleOptionChange}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <DatePickerModal
            setIsReportVisible={setIsReportVisible}
            reportStartDate={reportStartDate}
            setReportStartDate={setReportStartDate}
            reportEndDate={reportEndDate}
            setReportEndDate={setReportEndDate}
            setCustomDate={setCustomDate}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        ))}
    </>
  );
};

export default DateRangeSelectorModal;
