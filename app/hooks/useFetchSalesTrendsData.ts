import { useEffect, useMemo } from "react";
import { functions, httpsCallable } from "@/firebase/config";
import {
  formatDate,
  formatReadableDate,
} from "../(root)/overview/components/utils/formatDate";
import { useReportDataContext } from "../context/ReportDataContext";
import { DateRangeOptions } from "../(root)/overview/components/utils/DateRangeSelectorModal";
import {
  OrderData,
  OrderHourData,
  OrderMultiDayData,
  Totals,
} from "../src/types";

const useFetchSalesTrendsData = (
  kitchenId: string | null,
  selectedOption: string,
  reportStartDate: Date,
  reportEndDate: Date,
  previousReportStartDateRef: React.MutableRefObject<Date | null>,
  previousReportEndDateRef: React.MutableRefObject<Date | null>
) => {
  const {
    loading,
    setLoading,
    setAdvancedReportingError,
    setCustomDate,
    hourlyDataForTakeAwayAndDineIn,
    setHourlyDataForTakeAwayAndDineIn,
    multiDayDataForTakeAwayAndDineIn,
    setMultiDayDataForTakeAwayAndDineIn,
    setDineInTakeAwayTotals,
    dineInTakeAwayTotals,
  } = useReportDataContext();

  function calculateTotals(data: OrderData[]): Totals {
    let totalTakeAwayOrders = 0;
    let totalDineInOrders = 0;
    let totalTakeAwayNetSales = 0;
    let totalDineInNetSales = 0;

    data.forEach(entry => {
      totalTakeAwayOrders += entry.total_take_away_orders;
      totalDineInOrders += entry.total_dine_in_orders;
      totalTakeAwayNetSales += entry.total_take_away_net_sales;
      totalDineInNetSales += entry.total_dine_in_net_sales;
    });

    return {
      totalTakeAwayOrders,
      totalDineInOrders,
      totalTakeAwayNetSales,
      totalDineInNetSales,
    };
  }

  useEffect(() => {
    console.log("UFSTD");

    const fetchHourlyData = async () => {
      try {
        const hourlyDataForTakeAwayAndDineInResponse = httpsCallable(
          functions,
          "hourlyDataForTakeAwayAndDineIn"
        );

        const result = await hourlyDataForTakeAwayAndDineInResponse({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
        });

        const hourlyDataResponse = result.data as {
          hourlyDataForTakeAwayAndDineIn: OrderHourData[];
        };

        setHourlyDataForTakeAwayAndDineIn(
          hourlyDataResponse.hourlyDataForTakeAwayAndDineIn
        );
        setDineInTakeAwayTotals(
          calculateTotals(hourlyDataResponse.hourlyDataForTakeAwayAndDineIn)
        );
      } catch (error) {
        console.error("Failed to fetch hourly data:", error);
        setAdvancedReportingError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchMultiDayData = async () => {
      try {
        const multiDayDataForTakeAwayAndDineInResponse = httpsCallable(
          functions,
          "multiDayDataForTakeAwayAndDineIn"
        );

        const result = await multiDayDataForTakeAwayAndDineInResponse({
          kitchenId: kitchenId,
          fromReportDate: formatDate(reportStartDate),
          toReportDate: formatDate(reportEndDate),
        });

        const multiDayDataResponse = result.data as {
          multiDayDataForTakeAwayAndDineIn: OrderMultiDayData[];
        };

        setMultiDayDataForTakeAwayAndDineIn(
          multiDayDataResponse.multiDayDataForTakeAwayAndDineIn
        );
        setDineInTakeAwayTotals(
          calculateTotals(multiDayDataResponse.multiDayDataForTakeAwayAndDineIn)
        );
      } catch (error) {
        console.error("Failed to fetch multi-day data:", error);
        setAdvancedReportingError(true);
      } finally {
        setLoading(false);
      }
    };

    if (kitchenId !== null) {
      setMultiDayDataForTakeAwayAndDineIn([]);
      setHourlyDataForTakeAwayAndDineIn([]);
      setLoading(true);

      if (
        reportEndDate === reportStartDate ||
        selectedOption === DateRangeOptions.Today
      ) {
        fetchHourlyData();
      } else {
        fetchMultiDayData();
      }

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
    } else {
      setLoading(false);
    }
  }, [reportEndDate, reportStartDate, kitchenId, selectedOption]);

  const memoizedData = useMemo(
    () => ({
      hourlyDataForTakeAwayAndDineIn,
      multiDayDataForTakeAwayAndDineIn,
      dineInTakeAwayTotals,
      loading,
    }),
    [hourlyDataForTakeAwayAndDineIn, multiDayDataForTakeAwayAndDineIn]
  );

  return memoizedData;
};

export default useFetchSalesTrendsData;
