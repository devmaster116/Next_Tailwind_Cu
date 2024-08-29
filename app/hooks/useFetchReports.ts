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
import { DateRangeOptions } from "../(root)/overview/components/utils/DateRangeSelectorModal";

interface SelectedVariantsForDishResponseData {
  selectedVariantsForDish: SelectedVariantsForDishData[];
  status: string;
  code: number;
}

<<<<<<< HEAD
const useFetchReports = (
  kitchenId: string | null,
  reportStartDate: Date,
  reportEndDate: Date,
  selectedOption: string
) => {
=======
interface KitchenData {
  categories: any[];
  dishes: any[];
  dishByOrderType: any[];
  response: any;
}

const useFetchReports = (
  kitchenId: string | null,
  selectedOption: string,
  reportStartDate: Date,
  reportEndDate: Date,
  previousReportStartDateRef: React.MutableRefObject<Date | null>,
  previousReportEndDateRef: React.MutableRefObject<Date | null>,
  forceCallUseFetchReport?: boolean
) => {
  const [dishByOrderType, setDishByOrderType] = useState<any>(null);
>>>>>>> 24cf069 (Improve structure and readibility of hooks)
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
<<<<<<< HEAD
    dishByOrderType,
    setDishByOrderType,
=======
    setMultiDayDataForTakeAwayAndDineIn,
    setHourlyDataForTakeAwayAndDineIn,
>>>>>>> 24cf069 (Improve structure and readibility of hooks)
  } = useReportDataContext();

  useEffect(() => {
    const fetchOverviewReports = async () => {
      try {
        const overviewReports = httpsCallable(
          functions,
          "overviewReportFunction"
        );

        const result = await overviewReports({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        });

        const data = result.data as KitchenData;
        setOrdersData(data.response);
      } catch (error) {
        console.log("Failed to fetch overview reports:", error);
        setOverviewReportFunctionError(true);
      } finally {
        setLoading(false);
      }
    };
    const fetchAdvancedReports = async () => {
      try {
        const advancedReports = httpsCallable(functions, "advancedReporting");

        const result = await advancedReports({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        });

        const data = result.data as KitchenData;

        const allCategories = data.categories as Categories[];
        setAllCategories(allCategories);

        const allDishes = data.dishes as Dishes[];
        setAllDishes(allDishes);
      } catch (error) {
        console.error("Failed to fetch advanced reports:", error);
        setAdvancedReportingError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectedVariantsForDish = async () => {
      try {
        const selectedVariantsForDish = httpsCallable(
          functions,
          "getSelectedVariantsForDish"
        );

        const result = await selectedVariantsForDish({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        });
        const data = result.data as SelectedVariantsForDishResponseData;

        if (
          data &&
          (data.selectedVariantsForDish as SelectedVariantsForDishData[])
        ) {
          setSelectedVariants(data.selectedVariantsForDish);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch selected variants:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDishesCountByOrderType = async () => {
      try {
        const dishesCountByOrderType = httpsCallable(
          functions,
          "getDishesCountByOrderType"
        );

        const result = await dishesCountByOrderType({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        });

        const data = result.data as KitchenData;
        setDishByOrderType(data.dishByOrderType);
      } catch (error) {
        console.log(
          "Failed to fetch GetDishesCountByOrderType reports:",
          error
        );
        setOverviewReportFunctionError(true);
      } finally {
        setLoading(false);
      }
    };

    const isReportDateChanged =
      previousReportEndDateRef.current?.toDateString() !==
        reportEndDate.toDateString() ||
      previousReportStartDateRef.current?.toDateString() !==
        reportStartDate.toDateString();

    if (kitchenId !== null) {
      if (!ordersData || forceCallUseFetchReport || isReportDateChanged) {
        setMultiDayDataForTakeAwayAndDineIn([]);
        setHourlyDataForTakeAwayAndDineIn([]);

        fetchAdvancedReports();
        fetchOverviewReports();
        fetchSelectedVariantsForDish();
        fetchDishesCountByOrderType();

        setLoading(true);

        if (selectedOption === DateRangeOptions.Custom) {
          setCustomDate(
            `${formatReadableDate(reportStartDate)} - ${formatReadableDate(
              reportEndDate
            )}`
          );
        } else {
          setCustomDate(undefined);
        }

        previousReportEndDateRef.current = reportEndDate;
        previousReportStartDateRef.current = reportStartDate;
      }
    } else {
      setError(true);
      setLoading(false);
    }
  }, [reportStartDate, reportEndDate]);

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
