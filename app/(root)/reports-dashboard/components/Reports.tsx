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
import Skeleton from "./Skeleton";
import SalesData from "./SalesData";
import DatePicker from "react-datepicker";
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
    setLoading(true);
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
      })
      .catch(error => {
        console.error("Failed to advanced reports:", error);
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
      setLoading(false);
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
              <div className={styles.report}>
                <div className={styles.reportHeader}>
                  <div
                    className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
                  >
                    Top 5 Categories
                  </div>
                  <div
                    className={`${styles.reportItem} ${styles.countHeading}`}
                  >
                    Count
                  </div>
                  <div className={styles.headerItem}>Gross</div>{" "}
                </div>
                {loading && <Skeleton />}
                {!loading && (
                  <div className={styles.reportBody}>
                    {topCategories.length === 0 ? (
                      <div className={styles.reportRow}>
                        <div
                          className={`${styles.reportItem} ${styles.reportItemName}`}
                        >
                          <p className={styles.noDataText}>
                            No sale completed{" "}
                            {customDate
                              ? `between ${customDate}`
                              : selectedOption.toLocaleLowerCase()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      topCategories.map((category, i) => (
                        <div key={i} className={styles.reportRow}>
                          <div
                            className={`${styles.reportItem} ${styles.reportItemName}`}
                          >
                            {category.category_name}
                          </div>
                          <div className={styles.reportItem}>
                            {category.item_count}
                          </div>
                          <div className={styles.reportItem}>
                            ${category.total_price}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className={styles.report}>
                <div className={styles.reportHeader}>
                  <div
                    className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
                  >
                    Top 5 Items
                  </div>
                  <div
                    className={`${styles.reportItem} ${styles.countHeading}`}
                  >
                    Count
                  </div>
                  <div className={styles.headerItem}>Gross</div>
                </div>
                {loading && <Skeleton />}
                {!loading && (
                  <div className={styles.reportBody}>
                    {topDishes.length === 0 ? (
                      <div className={styles.reportRow}>
                        <div
                          className={`${styles.reportItem} ${styles.reportItemName}`}
                        >
                          <p className={styles.noDataText}>
                            No sale completed{" "}
                            {customDate
                              ? `between ${customDate}`
                              : selectedOption.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      topDishes.map((dish, i) => (
                        <div key={i} className={styles.reportRow}>
                          <div
                            className={`${styles.reportItem} ${styles.reportItemName}`}
                          >
                            {dish.dish_name}
                          </div>
                          <div className={styles.reportItem}>
                            {dish.item_count}
                          </div>
                          <div className={styles.reportItem}>
                            ${dish.total_price}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default withAuth(Reports);
