import { useEffect, useMemo } from "react";
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
import { DateRangeOptions } from "../(root)/overview/components/utils/DateRangeSelectorModal";

interface SelectedVariantsForDishResponseData {
  selectedVariantsForDish: SelectedVariantsForDishData[];
  status: string;
  code: number;
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
    setMultiDayDataForTakeAwayAndDineIn,
    setHourlyDataForTakeAwayAndDineIn,
  } = useReportDataContext();

  useEffect(() => {
    const fetchOverviewReports = async () => {
      const overviewReports = httpsCallable(
        functions,
        "overviewReportFunction"
      );
      const result = await overviewReports({
        kitchenId: kitchenId,
        fromReportDate: formatDate(reportStartDate),
        toReportDate: formatDate(reportEndDate),
      });
      return result.data as KitchenData;
    };

    const fetchAdvancedReports = async () => {
      const advancedReports = httpsCallable(functions, "advancedReporting");
      const result = await advancedReports({
        kitchenId: kitchenId,
        fromReportDate: formatDate(reportStartDate),
        toReportDate: formatDate(reportEndDate),
      });
      return result.data as KitchenData;
    };

    const fetchSelectedVariantsForDish = async () => {
      const selectedVariantsForDish = httpsCallable(
        functions,
        "getSelectedVariantsForDish"
      );
      const result = await selectedVariantsForDish({
        kitchenId: kitchenId,
        fromReportDate: formatDate(reportStartDate),
        toReportDate: formatDate(reportEndDate),
      });
      return result.data as SelectedVariantsForDishResponseData;
    };

    const fetchDishesCountByOrderType = async () => {
      const dishesCountByOrderType = httpsCallable(
        functions,
        "getDishesCountByOrderType"
      );
      const result = await dishesCountByOrderType({
        kitchenId: kitchenId,
        fromReportDate: formatDate(reportStartDate),
        toReportDate: formatDate(reportEndDate),
      });
      return result.data as KitchenData;
    };

    const fetchAllReports = async () => {
      setLoading(true);
      try {
        const [
          advancedReportsData,
          overviewReportsData,
          selectedVariantsData,
          dishesCountByOrderTypeData,
        ] = await Promise.all([
          fetchAdvancedReports(),
          fetchOverviewReports(),
          fetchSelectedVariantsForDish(),
          fetchDishesCountByOrderType(),
        ]);

        setOrdersData(overviewReportsData.response);
        setAllCategories(advancedReportsData.categories as Categories[]);
        setAllDishes(advancedReportsData.dishes as Dishes[]);
        setSelectedVariants(selectedVariantsData.selectedVariantsForDish);
        setDishByOrderType(dishesCountByOrderTypeData.dishByOrderType);

        if (selectedOption === DateRangeOptions.Custom) {
          setCustomDate(
            `${formatReadableDate(reportStartDate)} - ${formatReadableDate(
              reportEndDate
            )}`
          );
        } else {
          setCustomDate(undefined);
        }

        setError(false);
        setAdvancedReportingError(false);
        setOverviewReportFunctionError(false);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError(true);
        setAdvancedReportingError(true);
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
        fetchAllReports();

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
