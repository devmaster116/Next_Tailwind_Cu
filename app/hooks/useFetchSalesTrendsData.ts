import { useState, useEffect, useMemo, useRef } from "react";
import { functions, httpsCallable } from "@/firebase/config";
import {
  formatDate,
  formatReadableDate,
} from "../(root)/overview/components/utils/formatDate";
import { useReportDataContext } from "../context/ReportDataContext";
import { useReportDate } from "../context/ReportDateContext";
import { DateRangeOptions } from "../(root)/overview/components/utils/DateRangeSelectorModal";

const useFetchSalesTrendsData = (
  kitchenId: string | null,
  reportStartDate: Date,
  reportEndDate: Date,
  selectedOption: string
) => {
  const [salesData, setSalesData] = useState<any>(null);
  const { setLoading, setError, setAdvancedReportingError, setCustomDate } =
    useReportDataContext();

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
        previousReportEndDateRef.current?.toDateString() !==
          reportEndDateContext.toDateString() ||
        previousReportStartDateRef.current?.toDateString() !==
          reportStartDateContext.toDateString()
      ) {
        console.log("in in in");
        const hourlyDataForTakeAwayAndDineInResponse = httpsCallable(
          functions,
          "hourlyDataForTakeAwayAndDineIn"
        );

        const multiDayDataForTakeAwayAndDineInResponse = httpsCallable(
          functions,
          "multiDayDataForTakeAwayAndDineIn"
        );

        setLoading(true);
        console.log("selected options ==>", selectedOption);
        console.log(reportEndDate, reportStartDate);
        console.log("xxxxxxx", reportEndDate === reportStartDate);
        if (
          reportEndDate === reportStartDate ||
          selectedOption === DateRangeOptions.Today
        ) {
          hourlyDataForTakeAwayAndDineInResponse({
            kitchenId: kitchenId,
            fromReportDate: formatDate(reportStartDate),
          })
            .then(result => {
              setSalesData(result);
              console.log("RESULT ==>", result);
            })
            .catch(error => {
              console.error("Failed to fetch hourly data:", error);
              setAdvancedReportingError(true);
            });
        } else {
          multiDayDataForTakeAwayAndDineInResponse({
            kitchenId: kitchenId,
            fromReportDate: formatDate(reportStartDate),
            toReportDate: formatDate(reportEndDate),
          })
            .then(result => {
              setSalesData(result);
              console.log("RESULT 2 ==>", result);
            })
            .catch(error => {
              console.error("Failed to fetch hourly data:", error);
              setAdvancedReportingError(true);
            });
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

        setLoading(false);

        previousReportEndDateRef.current = reportEndDateContext;
        previousReportStartDateRef.current = reportStartDateContext;
      }
    } else {
      setError(true);
      setLoading(false);
    }
  }, [
    reportEndDateContext,
    reportStartDateContext,
    reportEndDate,
    kitchenId,
    functions,
    selectedOption,
    salesData,
  ]);

  const memoizedData = useMemo(
    () => ({
      salesData,
    }),
    [salesData]
  );

  return memoizedData;
};

export default useFetchSalesTrendsData;
