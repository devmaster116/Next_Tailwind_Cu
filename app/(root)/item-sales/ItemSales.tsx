"use client";
import React, { useEffect, useState } from "react";
import styles from "./ItemSales.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import withAuth from "@/app/components/Auth/withAuth";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal from "../overview/components/utils/DateRangeSelectorModal";
import { useKitchen } from "@/app/context/KitchenContext";
import DataError from "../overview/components/DataError";
import SalesData from "../overview/components/SalesData";
import { Dishes } from "@/app/src/types";
import DataTable from "../overview/components/DataTable";
import "../overview/components/DatePicker.scss";
import { getDishStats } from "./utils/commonUtils";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import { useReportDate } from "@/app/context/ReportDateContext";
import { removeGst } from "@/app/components/Auth/utils/helper";

const ItemSales = () => {
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
    allDishes,
    advancedReportingError,
  } = useFetchReports(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  const [dishStats, setDishesStats] = useState<{
    mostPopular: Dishes | null;
    highestNetSale: Dishes | null;
  }>({
    mostPopular: null,
    highestNetSale: null,
  });

  useEffect(() => {
    if (loading) {
      setNoSales(false);
      setDishesStats({
        mostPopular: null,
        highestNetSale: null,
      });
    } else {
      if (allDishes && allDishes.length > 0) {
        setNoSales(false);
        try {
          const stats = getDishStats(allDishes);
          setDishesStats(stats);
        } catch (error) {
          console.error("Error getting dish stats:", error);
        }
      } else {
        setDishesStats({
          mostPopular: null,
          highestNetSale: null,
        });
        setNoSales(true);
      }
    }
  }, [loading, allDishes]);

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
      <h1 className={styles.pageTitle}>Item Sales</h1>
      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving item sales data"
            errorDescription="Check your connectivity and try again."
          />
        </>
      ) : (
        <>
          {advancedReportingError ? (
            <DataError errorMessage="Error retrieving item data" />
          ) : !noSales ? (
            <>
              <div className={styles.salesDataContainer}>
                <SalesData
                  title="Most Popular"
                  item={dishStats.mostPopular?.dish_name}
                  isDollarAmount={false}
                  loading={loading}
                />
                <SalesData
                  title="Highest Net Sale"
                  item={dishStats.highestNetSale?.dish_name}
                  isDollarAmount={false}
                  loading={loading}
                />
              </div>

              <DataTable
                firstColumnTitle="Item Name"
                secondColumnTitle="Count"
                thirdColumnTitle="Net"
                secondColumnSymbol=""
                thirdColumnSymbol="$"
                dataObj={removeGst(allDishes)}
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

export default withAuth(ItemSales);
