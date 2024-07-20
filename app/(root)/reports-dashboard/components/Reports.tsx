"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../../../components/Auth/withAuth";
import { functions, httpsCallable } from "@/firebase/config";
import {
  Dishes,
  Categories,
  KitchenData,
  OrdersResponse,
} from "@/app/src/types";
import styles from "./Reports.module.scss";
import SalesData from "./SalesData";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, formatReadableDate, getTopFive } from "./utils/formatDate";
import "./DatePicker.scss";
import DataError from "./DataError";
import DataTable from "./DataTable";
import DateRangeSelectorModal from "./utils/DateRangeSelectorModal";
import useWindowSize from "@/app/hooks/useWindowSize";

const Reports = () => {
  const kitchenId = localStorage.getItem("kitchenId");
  const { width } = useWindowSize();

  const [advancedReportingError, setAdvancedReportingError] =
    useState<boolean>(false);
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<Categories[]>([]);
  const [topDishes, setTopDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("Today");

  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());
  const [customDate, setCustomDate] = useState<string>();

  const {
    total_net_sales,
    total_orders,
    total_refunded_sum,
    total_refunded_orders,
  } = ordersData[0] || {};

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
