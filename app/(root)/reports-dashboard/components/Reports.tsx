"use client";
import React, { useState } from "react";
import withAuth from "../../../components/Auth/withAuth";
import styles from "./Reports.module.scss";
import SalesData from "./SalesData";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";
import DataError from "./DataError";
import DataTable from "./DataTable";
import DateRangeSelectorModal from "./utils/DateRangeSelectorModal";
import useWindowSize from "@/app/hooks/useWindowSize";
import { useKitchen } from "../../../context/KitchenContext";
import useFetchReports from "@/app/hooks/useFetchReports";

const Reports = () => {
  const { width } = useWindowSize();

  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;

  const [selectedOption, setSelectedOption] = useState<string>("Today");
  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());

  const {
    loading,
    error,
    customDate,
    setCustomDate,
    ordersData,
    topDishes,
    topCategories,
    advancedReportingError,
    overviewReportFunctionError
  } = useFetchReports(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption,
    {
      fetchAdvancedReports: true,
      fetchOverviewReports: true,
    }
  );

  let total_net_sales = 0;
  let total_orders = 0;
  let total_refunded_sum = 0;

  if (ordersData?.length > 0) {
    ({ total_net_sales, total_orders, total_refunded_sum } = ordersData[0]);
  }

  return (
    <>
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

      {width && width >= 600 && <h1 className={styles.pageTitle}>Overview</h1>}

      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving dashboard data"
            errorDescription="Please try again later"
          />
        </>
      ) : (
        <>
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
                    title="Avg. Net Sale"
                    amount={Number((total_net_sales / total_orders).toFixed(2))}
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
      )}
    </>
  );
};

export default withAuth(Reports);
