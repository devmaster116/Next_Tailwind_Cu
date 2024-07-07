"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import withAuth from "../../../components/Auth/withAuth";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";
import {
  Dishes,
  Categories,
  KitchenData,
  OrdersResponse,
} from "@/app/src/types";
import styles from "./Reports.module.scss";
import SalesData from "./SalesData";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatDate,
  formatReadableDate,
  getTopFive,
  getYesterdayDate,
  getCurrentWeekRange,
  getCurrentMonthRange,
} from "./utils/formatDate";
import "./DatePicker.scss";
import RadioButton from "./RadioButton";
import Image from "next/image";
import calendar from "../../../../public/icons/calendar.svg";
import DataError from "./DataError";
import DataTable from "./DataTable";
import DatePickerModal from "./DatePickerModal";

const Reports = () => {
  const kitchenId = localStorage.getItem("kitchenId");

  const [advancedReportingError, setAdvancedReportingError] =
    useState<boolean>(false);
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<Categories[]>([]);
  const [topDishes, setTopDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersResponse[]>([]);

  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());

  const [isVisible, setIsVisible] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string>("Today");

  const [customDate, setCustomDate] = useState<string>();

  const showModal = () => {
    setIsVisible(true);
    setIsReportVisible(true);
    setTimeout(() => setIsAnimating(true), 0);
  };

  const hideModal = () => {
    setIsAnimating(false);
  };

  useEffect(() => {
    if (!isAnimating && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, isVisible]);

  function setReportDates(startDate: Date, endDate: Date): void {
    setReportStartDate(startDate);
    setReportEndDate(endDate);
    hideModal();
  }

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    switch (value) {
      case "Today":
        const today = new Date();
        setReportDates(today, today);
        setSelectedOption(value);
        break;
      case "Yesterday":
        const yesterday = getYesterdayDate();
        setReportDates(yesterday, yesterday);
        setSelectedOption(value);
        break;
      case "This Week":
        const { startDate, endDate } = getCurrentWeekRange();
        setReportDates(startDate, endDate);
        setSelectedOption(value);
        break;
      case "This Month":
        const { startMonthDate, endMonthDate } = getCurrentMonthRange();
        setReportDates(startMonthDate, endMonthDate);
        setSelectedOption(value);
        break;
      case "Custom":
        setIsReportVisible(false);
        break;
      default:
        console.log("No valid option selected");
    }
  };

  useEffect(() => {
    const advancedReports = httpsCallable(functions, "advancedReporting");
    const overviewReports = httpsCallable(functions, "overviewReportFunction");

    advancedReports({
      kitchenId: kitchenId,
      fromReportDate: formatDate(reportStartDate),
      toReportDate: formatDate(reportEndDate),
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;

        const topCategories = getTopFive(data.categories) as Categories[];
        setTopCategories(topCategories);

        const topDishes = getTopFive(data.dishes) as Dishes[];
        setTopDishes(topDishes);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch advanced reports:", error);
        setAdvancedReportingError(true);
      });

    overviewReports({
      kitchenId: kitchenId,
      fromReportDate: formatDate(reportStartDate),
      toReportDate: formatDate(reportEndDate),
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;
        setOrdersData(data.response);
        setLoading(false);
      })
      .catch(error => {
        console.log("Failed to fetch overview reports:", error);
        setOverviewReportFunctionError(true);
      });

    if (selectedOption === "Custom") {
      setCustomDate(
        `${formatReadableDate(reportStartDate)} - ${formatReadableDate(
          reportEndDate
        )}`
      );
    } else {
      setCustomDate(undefined);
      setSelectedOption(selectedOption);
    }

    Promise.allSettled([advancedReports, overviewReports]).finally(() => {
      setLoading(true);
    });
  }, [reportEndDate]);

  const {
    total_net_sales,
    total_orders,
    total_refunded_sum,
    total_refunded_orders,
  } = ordersData[0] || {};

  const options = [
    { value: "Today", label: "Today" },
    { value: "Yesterday", label: "Yesterday" },
    { value: "This Week", label: "This Week" },
    { value: "This Month", label: "This Month" },
    { value: "Custom", label: "Custom" },
  ];

  return (
    <>
      <div className={styles.timeSelector}>
        <button onClick={showModal}>
          <Image
            src={calendar}
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
                    src={calendar}
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
                {options.map(option => (
                  <RadioButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    checked={
                      option.value !== "Custom" &&
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
      {advancedReportingError && overviewReportFunctionError ? (
        <DataError errorMessage="Error retrieving dashboard data" />
      ) : (
        <>
          {overviewReportFunctionError ? (
            <DataError errorMessage="Error retrieving summary data" />
          ) : (
            <div className={styles.salesDataContainer}>
              <SalesData
                title="Net Sales"
                amount={Number(total_net_sales)}
                isDollarAmount={true}
                loading={loading}
              />
              <SalesData
                title="Orders"
                amount={total_orders}
                isDollarAmount={false}
                loading={loading}
              />
              <SalesData
                title="Avg. Order"
                amount={Number(
                  (
                    total_net_sales /
                    (total_orders - total_refunded_orders)
                  ).toFixed(2)
                )}
                isDollarAmount={true}
                loading={loading}
              />
              <SalesData
                title="Refunds"
                amount={total_refunded_sum}
                isDollarAmount={true}
                loading={loading}
              />
            </div>
          )}
          {advancedReportingError ? (
            <DataError errorMessage="Error retrieving category and item data" />
          ) : (
            <>
              <DataTable
                firstColumnTitle="Top 5 categories"
                secondColumnTitle="Count"
                thirdColumnTitle="Gross"
                secondColumnSymbol=""
                thirdColumnSymbol="$"
                dataObj={topCategories}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              <DataTable
                firstColumnTitle="Top 5 items"
                secondColumnTitle="Count"
                thirdColumnTitle="Gross"
                thirdColumnSymbol="$"
                dataObj={topDishes}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default withAuth(Reports);
