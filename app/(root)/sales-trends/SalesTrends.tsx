"use client";
import React from "react";
import { useReportDate } from "@/app/context/ReportDateContext";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal from "../overview/components/utils/DateRangeSelectorModal";
import "../overview/components/DatePicker.scss";
import { useKitchen } from "@/app/context/KitchenContext";
import styles from "./SalesTrends.module.scss";
import useFetchSalesTrendsData from "@/app/hooks/useFetchSalesTrendsData";

const SalesTrends = () => {
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  console.log(kitchenId);

  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
  } = useReportDate();

  const {
    loading,
    error,
    customDate,
    setCustomDate,
    ordersData,
    dishByOrderType,
    overviewReportFunctionError,
  } = useFetchReports(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  const { testData } = useFetchSalesTrendsData(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  // console.log(testData);
  return (
    <div>
      <DateRangeSelectorModal
        reportStartDate={reportStartDate}
        setReportStartDate={setReportStartDate}
        reportEndDate={reportEndDate}
        setReportEndDate={setReportEndDate}
        customDate={customDate}
        setCustomDate={setCustomDate}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <h1 className={styles.pageTitle}>Sales Trends</h1>
    </div>
  );
};

export default SalesTrends;
