"use client";
import React, { useEffect, useState } from "react";
import styles from "./CategorySales.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import withAuth from "@/app/components/Auth/withAuth";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal from "../overview/components/utils/DateRangeSelectorModal";
import { useKitchen } from "@/app/context/KitchenContext";
import DataError from "../overview/components/DataError";
import SalesData from "../overview/components/SalesData";
import { Categories } from "@/app/src/types";
import DataTable from "../overview/components/DataTable";
import "../overview/components/DatePicker.scss";
import { getCategoryStats } from "./utils/commonUtils";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import { useReportDate } from "@/app/context/ReportDateContext";
import { removeGst } from "@/app/components/Auth/utils/helper";

const CategorySales = () => {
  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
  } = useReportDate();

  const [noSales, setNoSales] = useState<boolean>(false);
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
    selectedOption
  );

  const [categoryStats, setCategoryStats] = useState<{
    mostPopular: Categories | null;
    highestNetSale: Categories | null;
  }>({
    mostPopular: null,
    highestNetSale: null,
  });

  useEffect(() => {
    if (loading) {
      setNoSales(false);
      setCategoryStats({
        mostPopular: null,
        highestNetSale: null,
      });
    } else {
      if (allCategories && allCategories.length > 0) {
        setNoSales(false);
        try {
          const stats = getCategoryStats(allCategories);
          setCategoryStats(stats);
        } catch (error) {
          console.error("Error getting category stats:", error);
        }
      } else {
        setCategoryStats({
          mostPopular: null,
          highestNetSale: null,
        });
        setNoSales(true);
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
      <h1 className={styles.pageTitle}>Category Sales</h1>
      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving category data"
            errorDescription="Check your connectivity and try again."
          />
        </>
      ) : (
        <>
          {advancedReportingError ? (
            <DataError errorMessage="Error retrieving category data" />
          ) : !noSales ? (
            <>
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
              </div>

              <DataTable
                firstColumnTitle="Category Name"
                secondColumnTitle="Count"
                thirdColumnTitle="Net"
                secondColumnSymbol=""
                thirdColumnSymbol="$"
                dataObj={removeGst(allCategories)}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
            </>
          ) : (
            <NoSalesMessage
              message="No sales in selected period"
              messageDescription={`${
                customDate
                  ? `between ${customDate}`
                  : `No sale completed ${selectedOption?.toLowerCase()}.`
              }`}
            />
          )}
        </>
      )}
    </>
  );
};

export default withAuth(CategorySales);
