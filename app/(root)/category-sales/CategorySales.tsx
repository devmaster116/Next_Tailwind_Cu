"use client";
import React, { useEffect, useState } from "react";
import styles from "./CategorySales.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import withAuth from "@/app/components/Auth/withAuth";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal from "../reports-dashboard/components/utils/DateRangeSelectorModal";
import useWindowSize from "@/app/hooks/useWindowSize";
import { useKitchen } from "@/app/context/KitchenContext";
import DataError from "../reports-dashboard/components/DataError";
import SalesData from "../reports-dashboard/components/SalesData";
import { Categories } from "@/app/src/types";
import DataTable from "../reports-dashboard/components/DataTable";
import "../reports-dashboard/components/DatePicker.scss";
import { getCategoryStats } from "./utils/commonUtils";

const CategorySales = () => {
  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());

  const [selectedOption, setSelectedOption] = useState<string>("Today");
  const { width } = useWindowSize();
  const { kitchen } = useKitchen();

  const kitchenId = kitchen?.kitchenId ?? null;

  const {
    loading,
    error,
    customDate,
    setCustomDate,
    allCategories,
    advancedReportingError,
  } = useFetchReports(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption,
    {
      fetchAdvancedReports: true,
      fetchOverviewReports: false,
    }
  );

  const [categoryStats, setCategoryStats] = useState<{
    mostPopular: Categories | null;
    highestNetSale: Categories | null;
    leastPopular: Categories | null;
    lowestNetSale: Categories | null;
  }>({
    mostPopular: null,
    highestNetSale: null,
    leastPopular: null,
    lowestNetSale: null,
  });

  useEffect(() => {
    if (!loading && allCategories && allCategories.length > 0) {
      try {
        const stats = getCategoryStats(allCategories);
        console.log("stats ==>", stats);
        setCategoryStats(stats);
      } catch (error) {
        console.error("Error getting category stats:", error);
      }
    }
  }, [loading, allCategories]);

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
      {width && width >= 600 && (
        <h1 className={styles.pageTitle}>Category Sales</h1>
      )}
      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving dashboard data"
            errorDescription="Please try again later"
          />
        </>
      ) : (
        <>
          {advancedReportingError ? (
            <DataError errorMessage="Error retrieving category data" />
          ) : (
            <div className={styles.salesDataContainer}>
              <SalesData
                title="Most Popular"
                item={categoryStats.mostPopular?.category_name}
                isDollarAmount={false}
                loading={loading}
              />
              <SalesData
                title="Highest Net Sale"
                item={categoryStats.highestNetSale?.category_name}
                isDollarAmount={false}
                loading={loading}
              />
              <SalesData
                title="Least Popular"
                item={categoryStats.leastPopular?.category_name}
                isDollarAmount={false}
                loading={loading}
              />
              <SalesData
                title="Lowest Net Sale"
                item={categoryStats.lowestNetSale?.category_name}
                isDollarAmount={false}
                loading={loading}
              />
            </div>
          )}
          <>
            <DataTable
              firstColumnTitle="Category Name"
              secondColumnTitle="Count"
              thirdColumnTitle="Net"
              secondColumnSymbol=""
              thirdColumnSymbol="$"
              dataObj={allCategories}
              loading={loading}
              customDate={customDate}
              selectedOption={selectedOption}
            />
          </>
        </>
      )}
    </>
  );
};

export default withAuth(CategorySales);
