import { useState, useEffect } from "react";
import { functions, httpsCallable } from "@/firebase/config";
import {
  formatDate,
  formatReadableDate,
  getTopFive,
} from "../(root)/reports-dashboard/components/utils/formatDate";
import { Categories, Dishes } from "../src/types";

interface KitchenData {
  categories: any[];
  dishes: any[];
  dishByOrderType: any[];
  response: any;
}

interface UseFetchReportsOptions {
  fetchAdvancedReports?: boolean;
  fetchOverviewReports?: boolean;
  fetchDishesCountByOrderType?: boolean
}

const useFetchReports = (
  kitchenId: string | null,
  reportStartDate: Date,
  reportEndDate: Date,
  selectedOption: string,
  options: UseFetchReportsOptions = {}
) => {
  const [allCategories, setAllCategories] = useState<Categories[]>([]);
  const [allDishes, setAllDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<any>(null);
  const [dishByOrderType, setDishByOrderType] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [advancedReportingError, setAdvancedReportingError] = useState(false);
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState(false);
  const [customDate, setCustomDate] = useState<string | undefined>();

  useEffect(() => {
    if (kitchenId !== null) {
      const advancedReports = httpsCallable(functions, "advancedReporting");
      const overviewReports = httpsCallable(
        functions,
        "overviewReportFunction"
      );
      const dishesCountByOrderType = httpsCallable(
        functions,
        "getDishesCountByOrderType"
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

        const fetchGetDishesCountByOrderType = options.fetchDishesCountByOrderType
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
              console.log("Failed to fetch GetDishesCountByOrderType reports:", error);
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

      Promise.allSettled([fetchAdvancedReports, fetchOverviewReports, fetchGetDishesCountByOrderType]).finally(
        () => {
          setLoading(false);
        }
      );
    } else {
      setError(true);
      setLoading(false);
    }
  }, [reportEndDate]);

  return {
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
  };
};

export default useFetchReports;
