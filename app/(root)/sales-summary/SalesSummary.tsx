"use client";
import React, { useEffect, useState } from "react";
import styles from "./SalesSummary.module.scss";
import "../overview/components/DatePicker.scss";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "../overview/components/DataTable";
import DateRangeSelectorModal from "../overview/components/utils/DateRangeSelectorModal";
import DataError from "../overview/components/DataError";
import SalesData from "../overview/components/SalesData";
import useWindowSize from "@/app/hooks/useWindowSize";
import withAuth from "@/app/components/Auth/withAuth";
import { useKitchen } from "../../context/KitchenContext";
import { useReportDate } from "../../context/ReportDateContext";
import useFetchReports from "@/app/hooks/useFetchReports";
import { dishDetailsByOrderTypeParser } from "./utils/dishDetailsByOrderTypeParser";
import NoSalesMessage from "../overview/components/NoSalesMessage";

const SalesSummary = () => {
  const { width } = useWindowSize();
  const { kitchen } = useKitchen();
  const [noSales, setNoSales] = useState<boolean>(false);

  const kitchenId = kitchen?.kitchenId ?? null;

  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
    previousReportStartDateRef,
    previousReportEndDateRef,
  } = useReportDate();

  const {
    loading,
    error,
    customDate,
    setCustomDate,
    ordersData,
    dishByOrderType,
    overviewReportFunctionError,
  } = useFetchReports(
    kitchenId,
    selectedOption,
    reportStartDate,
    reportEndDate,
    previousReportStartDateRef,
    previousReportEndDateRef
  );

  useEffect(() => {
    if (loading) {
      setNoSales(false);
    } else {
      if (ordersData && ordersData.length > 0) {
        setNoSales(false);
      } else {
        setNoSales(true);
      }
    }
  }, [loading, ordersData]);

  const calculatePercentage = (
    numerator: number,
    denominator: number,
    fixedTo?: number
  ): string => {
    if (denominator === 0) {
      return "0";
    }

    return ((numerator / denominator) * 100).toFixed(fixedTo ?? 2);
  };

  let dine_in_order_net_avg = 0;
  let online_order_net_avg = 0;
  let take_away_order_net_avg = 0;
  let total_card_orders = 0;
  let total_card_sum = 0;
  let total_take_away_sum = 0;
  let total_dine_in_sum = 0;
  let total_card_surcharge = 0;
  let total_card_tip = 0;
  let total_cash_orders = 0;
  let total_cash_sum = 0;
  let total_dine_in_orders = 0;
  let total_holiday_surcharge = 0;
  let total_net_sales = 0;
  let total_online_orders = 0;
  let total_orders = 0;
  let total_refunded_sum = 0;
  let total_revenue = 0;
  let total_take_away_orders = 0;
  let total_split_payment_orders = 0;
  let total_split_payment_sum = 0;
  let total_take_away_card_surcharge = 0;
  let total_dine_in_card_surcharge = 0;

  if (ordersData?.length > 0) {
    ({
      dine_in_order_net_avg,
      online_order_net_avg,
      take_away_order_net_avg,
      total_card_orders,
      total_card_sum,
      total_take_away_sum,
      total_dine_in_sum,
      total_card_surcharge,
      total_card_tip,
      total_cash_orders,
      total_cash_sum,
      total_dine_in_orders,
      total_holiday_surcharge,
      total_net_sales,
      total_online_orders,
      total_orders,
      total_refunded_sum,
      total_revenue,
      total_take_away_orders,
      total_split_payment_orders,
      total_split_payment_sum,
      total_take_away_card_surcharge,
      total_dine_in_card_surcharge,
    } = ordersData[0]);
  }

  const takeAwayItemDetails = dishDetailsByOrderTypeParser(
    dishByOrderType,
    "Take Away"
  );
  const dineInItemDetails = dishDetailsByOrderTypeParser(
    dishByOrderType,
    "Dine In"
  );

  const takeAwayItemCount = takeAwayItemDetails
    ? takeAwayItemDetails.itemCount
    : 0;

  const dineInItemCount = dineInItemDetails ? dineInItemDetails.itemCount : 0;

  const takeAwayAverageItems =
    takeAwayItemCount && total_take_away_orders
      ? Math.round(takeAwayItemCount / total_take_away_orders)
      : 0;

  const dineInAverageItems =
    dineInItemCount && total_dine_in_orders
      ? Math.round(dineInItemCount / total_dine_in_orders)
      : 0;

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
      <h1 className={styles.pageTitle}>Sales Summary</h1>
      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving dashboard data"
            errorDescription="Please try again later"
          />
        </>
      ) : (
        <>
          {overviewReportFunctionError ? (
            <DataError errorMessage="Error retrieving summary data" />
          ) : !noSales ? (
            <>
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
                  wholeNumber={true}
                />
                <SalesData
                  title="Avg. Net Sale"
                  amount={Number(total_net_sales / total_orders)}
                  isDollarAmount={true}
                  loading={loading}
                />
                <SalesData
                  title="Dine In / Take Away"
                  amount={Number(
                    calculatePercentage(
                      total_dine_in_orders,
                      total_take_away_orders + total_dine_in_orders || 0,
                      1
                    )
                  )}
                  secondAmount={Number(
                    calculatePercentage(
                      total_take_away_orders,
                      total_take_away_orders + total_dine_in_orders || 0,
                      1
                    )
                  )}
                  isPercentage={true}
                  loading={loading}
                />
              </div>
              <DataTable
                firstColumnTitle="Gross Sales"
                secondColumnTitle={total_revenue || 0}
                isSecondColumnNumber={true}
                secondColumnSymbol="$"
                negative={true}
                dataObj={[
                  {
                    title: "Card Surcharges (Paid by customer)",
                    card: total_card_surcharge || 0,
                  },
                  {
                    title: "Tips",
                    tips: total_card_tip || 0,
                  },
                  {
                    title: "Refunds",
                    refund: total_refunded_sum || 0,
                  },
                  {
                    title: "GST",
                    refund: total_net_sales * 0.1 || 0,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              <DataTable
                firstColumnTitle="Net Sales"
                secondColumnTitle={total_net_sales || 0}
                isSecondColumnNumber={true}
                secondColumnSymbol="$"
                dataObj={[
                  {
                    title: "Includes PH Surcharge",
                    tips: total_holiday_surcharge || 0,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              {width && width >= 600 ? (
                <div className={styles.hrContainer}>
                  <hr className={styles.hrLine} />
                  <h4 className={styles.hrText}>Breakdowns</h4>
                  <hr className={styles.hrLine} />
                </div>
              ) : (
                <>
                  <div className={styles.separator}></div>
                  <h4>Breakdowns</h4>
                </>
              )}
              <DataTable
                firstColumnTitle="Order Type"
                secondColumnTitle="Count (%)"
                thirdColumnTitle="Net"
                thirdColumnSymbol="$"
                dataObj={[
                  {
                    title: "Take Away",
                    takeAway: `${
                      total_take_away_orders || 0
                    }  (${calculatePercentage(
                      total_take_away_orders,
                      total_take_away_orders + total_dine_in_orders || 0,
                      1
                    )}%)`,
                    net: total_take_away_sum
                      ? (total_take_away_sum - total_take_away_card_surcharge) /
                        1.1
                      : 0,
                  },
                  {
                    title: "Dine In",
                    dine: `${total_dine_in_orders || 0}  (${calculatePercentage(
                      total_dine_in_orders,
                      total_take_away_orders + total_dine_in_orders || 0,
                      1
                    )}%)`,
                    net: total_dine_in_sum
                      ? (total_dine_in_sum - total_dine_in_card_surcharge) / 1.1
                      : 0,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              <DataTable
                firstColumnTitle="Payment Type"
                secondColumnTitle="%"
                thirdColumnTitle="Net"
                thirdColumnSymbol="$"
                dataObj={[
                  {
                    title: "Cash",
                    percentage: `${
                      total_cash_orders || 0
                    }  (${calculatePercentage(
                      total_cash_sum,
                      total_cash_sum +
                        total_card_sum +
                        total_split_payment_sum || 0,
                      1
                    )}%)`,
                    net: total_cash_sum / 1.1 || 0,
                  },
                  {
                    title: "Card",
                    percentage: `${
                      total_card_orders || 0
                    }  (${calculatePercentage(
                      total_card_sum,
                      total_cash_sum +
                        total_card_sum +
                        total_split_payment_sum || 0,
                      1
                    )}%)`,
                    net: (total_card_sum - total_card_surcharge) / 1.1 || 0,
                  },
                  {
                    title: "Split",
                    percentage: `${
                      total_split_payment_orders || 0
                    }  (${calculatePercentage(
                      total_split_payment_sum,
                      total_cash_sum +
                        total_card_sum +
                        total_split_payment_sum || 0,
                      1
                    )}%)`,
                    net: total_split_payment_sum / 1.1 || 0,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              <DataTable
                firstColumnTitle="Tips"
                secondColumnTitle="Net"
                secondColumnSymbol="$"
                dataObj={[
                  {
                    title: "Card",
                    net: total_card_tip || 0,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
              {width && width >= 600 ? (
                <div className={styles.hrContainer}>
                  <hr className={styles.hrLine} />
                  <h4 className={styles.hrText}>Averages</h4>
                  <hr className={styles.hrLine} />
                </div>
              ) : (
                <>
                  <div className={styles.separator}></div>
                  <h4>Averages</h4>
                </>
              )}
              <DataTable
                firstColumnTitle="Order Type"
                secondColumnTitle="Avg no. of items"
                secondColumnSymbol=""
                thirdColumnTitle="Net Avg"
                thirdColumnSymbol="$"
                dataObj={[
                  {
                    title: "Take Away Order",
                    averageItem: takeAwayAverageItems,
                    netAvg: take_away_order_net_avg || 0,
                  },
                  {
                    title: "Dine-in Order",
                    averageItem: dineInAverageItems,
                    netAvg: dine_in_order_net_avg || 0,
                  },
                ]}
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

export default withAuth(SalesSummary);
