import { useState, useEffect, useMemo, useRef } from "react";
import { functions, httpsCallable } from "@/firebase/config";
import {
  formatDate,
  formatReadableDate,
} from "../(root)/reports-dashboard/components/utils/formatDate";
import { Categories, Dishes } from "../src/types";
import { useReportDataContext } from "../context/ReportDataContext";
import { useReportDate } from "../context/ReportDateContext";

interface KitchenData {
  categories: any[];
  dishes: any[];
  dishByOrderType: any[];
  response: any;
}

interface UseFetchReportsOptions {
  fetchAdvancedReports?: boolean;
  fetchOverviewReports?: boolean;
  fetchDishesCountByOrderType?: boolean;
}

const useFetchReports = (
  kitchenId: string | null,
  reportStartDate: Date,
  reportEndDate: Date,
  selectedOption: string,
  options: UseFetchReportsOptions = {}
) => {
  const {
    allCategories,
    setAllCategories,
    allDishes,
    setAllDishes,
    ordersData,
    setOrdersData,
    loading,
    setLoading,
    error,
    setError,
    advancedReportingError,
    setAdvancedReportingError,
    overviewReportFunctionError,
    setOverviewReportFunctionError,
    customDate,
    setCustomDate,
  } = useReportDataContext();

  const {
    reportEndDate: reportEndDateContext,
    reportStartDate: reportStartDateContext,
  } = useReportDate();

  const previousReportEndDateRef = useRef<Date | null>(reportEndDateContext);
  const previousReportStartDateRef = useRef<Date | null>(
    reportStartDateContext
  );

  useEffect(() => {
    if (kitchenId !== null) {
      if (
        !ordersData ||
        previousReportEndDateRef.current?.toDateString() !==
          reportEndDateContext.toDateString() ||
        previousReportStartDateRef.current?.toDateString() !==
          reportStartDateContext.toDateString()
      ) {
        const advancedReports = httpsCallable(functions, "advancedReporting");
        const overviewReports = httpsCallable(
          functions,
          "overviewReportFunction"
        );

        setLoading(true);

        const fetchAdvancedReports = options.fetchAdvancedReports
          ? advancedReports({
              kitchenId: kitchenId,
              fromReportDate: formatDate(reportStartDate),
              toReportDate: formatDate(reportEndDate),
            })
              .then(result => {
                const data = result.data as KitchenData;
                const allCategories = data.categories as Categories[];
                setAllCategories(allCategories);
                const allDishes = data.dishes as Dishes[];
                setAllDishes(allDishes);
              })
              .catch(error => {
                console.error("Failed to fetch advanced reports:", error);
                setAdvancedReportingError(true);
              })
          : Promise.resolve();

        const fetchOverviewReports = options.fetchOverviewReports
          ? overviewReports({
              kitchenId: kitchenId,
              fromReportDate: formatDate(reportStartDate),
              toReportDate: formatDate(reportEndDate),
            })
              .then(result => {
                const data = result.data as KitchenData;
                setOrdersData(data.response);
              })
              .catch(error => {
                console.log("Failed to fetch overview reports:", error);
                setOverviewReportFunctionError(true);
              })
          : Promise.resolve();

        const fetchGetDishesCountByOrderType =
          options.fetchDishesCountByOrderType
            ? dishesCountByOrderType({
                kitchenId: kitchenId,
                fromReportDate: formatDate(reportStartDate),
                toReportDate: formatDate(reportEndDate),
              })
                .then(result => {
                  const data = result.data as KitchenData;
                  setDishByOrderType(data.dishByOrderType);
                })
                .catch(error => {
                  console.log(
                    "Failed to fetch GetDishesCountByOrderType reports:",
                    error
                  );
                  setOverviewReportFunctionError(true);
                })
            : Promise.resolve();

        if (selectedOption === "Custom") {
          setCustomDate(
            `${formatReadableDate(reportStartDate)} - ${formatReadableDate(
              reportEndDate
            )}`
          );
        } else {
          setCustomDate(undefined);
        }

        Promise.allSettled([
          fetchAdvancedReports,
          fetchOverviewReports,
          fetchGetDishesCountByOrderType,
        ]).finally(() => {
          setLoading(false);
        });

        // Update the previous values
        previousReportEndDateRef.current = reportEndDateContext;
        previousReportStartDateRef.current = reportStartDateContext;
      }
    } else {
      setError(true);
      setLoading(false);
    }
  }, [reportEndDateContext, reportStartDateContext]);

  const memoizedData = useMemo(
    () => ({
      allCategories,
      allDishes,
      ordersData,
      dishByOrderType,
      loading,
      error,
      advancedReportingError,
      overviewReportFunctionError,
      customDate,
      setCustomDate,
    }),
    [
      allCategories,
      allDishes,
      ordersData,
      dishByOrderType,
      loading,
      error,
      advancedReportingError,
      overviewReportFunctionError,
      customDate,
    ]
  );

  return memoizedData;
};

export default useFetchReports;
