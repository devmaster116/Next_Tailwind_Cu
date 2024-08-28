import { useState, useEffect, useMemo, useRef } from "react";
import { functions, httpsCallable } from "@/firebase/config";
import {
  formatDate,
  formatReadableDate,
} from "../(root)/overview/components/utils/formatDate";
import {
  Categories,
  Dishes,
  KitchenData,
  SelectedVariantsForDishData,
} from "../src/types";
import { useReportDataContext } from "../context/ReportDataContext";
import { useReportDate } from "../context/ReportDateContext";
import useFetchSalesTrendsData from "./useFetchSalesTrendsData";

interface SelectedVariantsForDishResponseData {
  selectedVariantsForDish: SelectedVariantsForDishData[];
  status: string;
  code: number;
}

const useFetchReports = (
  kitchenId: string | null,
  reportStartDate: Date,
  reportEndDate: Date,
  selectedOption: string
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
    selectedVariants,
    setSelectedVariants,
    dishByOrderType,
    setDishByOrderType,
  } = useReportDataContext();

  const {
    reportStartDate,
    reportEndDate,
    previousReportStartDateRef,
    previousReportEndDateRef,
  } = useReportDate();

  // const { salesData, totals } = useFetchSalesTrendsData(
  //   kitchenId,
  //   reportStartDateContext,
  //   reportEndDateContext,
  //   selectedOption
  // );

  useEffect(() => {
    if (kitchenId !== null) {
      if (
        !ordersData ||
        previousReportEndDateRef.current?.toDateString() !==
          reportEndDate.toDateString() ||
        previousReportStartDateRef.current?.toDateString() !==
          reportStartDate.toDateString()
      ) {
        const advancedReports = httpsCallable(functions, "advancedReporting");
        const overviewReports = httpsCallable(
          functions,
          "overviewReportFunction"
        );
        const dishesCountByOrderType = httpsCallable(
          functions,
          "getDishesCountByOrderType"
        );
        const selectedVariantsForDish = httpsCallable(
          functions,
          "getSelectedVariantsForDish"
        );
        setLoading(true);

        const fetchAdvancedReports = advancedReports({
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
          });

        selectedVariantsForDish({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        })
          .then(result => {
            const data = result.data as SelectedVariantsForDishResponseData;

            if (
              data &&
              (data.selectedVariantsForDish as SelectedVariantsForDishData[])
            ) {
              setSelectedVariants(data.selectedVariantsForDish);
            } else {
              console.error("Unexpected data format:", data);
            }
          })
          .catch(error => {
            console.error("Failed to fetch selected variants:", error);
          });

        const fetchOverviewReports = overviewReports({
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
          });

        const fetchDishesCountByOrderType = dishesCountByOrderType({
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
          });

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
          fetchDishesCountByOrderType,
        ]).finally(() => {
          setLoading(false);
        });

        previousReportEndDateRef.current = reportEndDate;
        previousReportStartDateRef.current = reportStartDate;
      }
    } else {
      setError(true);
      setLoading(false);
    }
  }, [
    reportEndDate,
    reportStartDate,
    kitchenId,
    functions,
    selectedOption,
    ordersData,
  ]);

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
      selectedVariants,
      // salesData,
      // totals,
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
      selectedVariants,
    ]
  );

  return memoizedData;
};

export default useFetchReports;
