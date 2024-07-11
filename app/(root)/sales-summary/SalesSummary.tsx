"use client";
import React, { useEffect, useState } from "react";
import styles from "./SalesSummary.module.scss";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";
import { KitchenData, OrdersResponse } from "@/app/src/types";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatDate,
  formatReadableDate,
} from "../reports-dashboard/components/utils/formatDate";
import DataTable from "../reports-dashboard/components/DataTable";
import DateRangeSelectorModal from "../reports-dashboard/components/utils/DateRangeSelectorModal";
import DataError from "../reports-dashboard/components/DataError";
import SalesData from "../reports-dashboard/components/SalesData";

const SalesSummary = () => {
  const [kitchenId, setKitchenId] = useState<string>("defaultKitchenId");
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<OrdersResponse[]>([]);

  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());

  const [selectedOption, setSelectedOption] = useState<string>("Today");

  const [customDate, setCustomDate] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("kitchenId");
      if (id) {
        setKitchenId(id);
      }
    }
  }, []);

  useEffect(() => {
    const overviewReports = httpsCallable(functions, "overviewReportFunction");
    overviewReports({
      kitchenId: kitchenId,
      fromReportDate: formatDate(reportStartDate),
      toReportDate: formatDate(reportEndDate),
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;
        console.log("DATA ", data);
        setReportsData(data.response);
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

    Promise.allSettled([overviewReports]).finally(() => {
      setLoading(true);
    });
  }, [reportEndDate]);

  const calculatePercentage = (
    numerator: number,
    denominator: number
  ): string => {
    if (denominator === 0) {
      return "0.00";
    }
    return ((numerator / denominator) * 100).toFixed(2);
  };
  console.log("Orders data ==>", reportsData);

  const {
    total_card_orders,
    total_card_sum,
    total_card_surcharge,
    total_card_tip,
    total_cash_orders,
    total_cash_sum,
    total_dine_in_orders,
    total_holiday_surcharge,
    total_net_sales,
    total_orders,
    total_refunded_orders,
    total_refunded_sum,
    total_revenue,
    total_split_payment_orders,
    total_split_payment_sum,
    total_take_away_orders,
  } = reportsData[0] || {};

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
              total_net_sales / (total_orders - total_refunded_orders)
            )}
            isDollarAmount={true}
            loading={loading}
          />
          <SalesData
            title="Dine In / Take Away"
            amount={Number(
              (
                total_dine_in_orders /
                  (total_take_away_orders + total_dine_in_orders) || 0
              ).toFixed(1)
            )}
            secondAmount={Number(
              (
                total_take_away_orders /
                  (total_take_away_orders + total_dine_in_orders) || 0
              ).toFixed(1)
            )}
            isPercentage={true}
            loading={loading}
          />
        </div>

        // total_take_away_orders /
        //       (total_take_away_orders + total_dine_in_orders) || 0 * 100
        //   )
      )}
      <DataTable
        firstColumnTitle="Gross Sales"
        secondColumnTitle={`$${String(
          total_net_sales +
            total_card_surcharge +
            total_card_tip +
            total_refunded_sum || 0
        )}`}
        secondColumnSymbol="$"
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
        ]}
        loading={loading}
        customDate={customDate}
        selectedOption={selectedOption}
      />
      <DataTable
        firstColumnTitle="Net Sales"
        secondColumnTitle={`$${String(total_net_sales || 0)}`}
        secondColumnSymbol="$"
        dataObj={[
          {
            title: "Includes GST 10%",
            sales: total_net_sales / 11 || 0,
          },
          {
            title: "Includes PH Surcharge 15%",
            tips: total_card_tip || 0,
          },
        ]}
        loading={loading}
        customDate={customDate}
        selectedOption={selectedOption}
      />
      <div className={styles.separator}></div>
      <h4>Breakdowns</h4>
      <DataTable
        firstColumnTitle="Order Type"
        secondColumnTitle="Count (%)"
        secondColumnSymbol="%"
        dataObj={[
          {
            title: "Take Away",
            takeAway: `${total_take_away_orders || 0} - ${calculatePercentage(
              total_take_away_orders,
              total_take_away_orders + total_dine_in_orders
            )}`,
          },
          {
            title: "Dine In",
            dine: `${total_dine_in_orders || 0} - ${calculatePercentage(
              total_dine_in_orders,
              total_take_away_orders + total_dine_in_orders
            )}`,
          },
        ]}
        loading={loading}
        customDate={customDate}
        selectedOption={selectedOption}
      />
      <DataTable
        firstColumnTitle="Payment Type"
        secondColumnTitle="%"
        secondColumnSymbol="%"
        thirdColumnTitle="Net"
        thirdColumnSymbol="$"
        dataObj={[
          {
            title: "Cash",
            percentage: calculatePercentage(
              total_cash_sum,
              total_cash_sum + total_card_sum
            ),
            net: total_cash_sum || 0,
          },
          {
            title: "Card",
            percentage: calculatePercentage(
              total_card_sum,
              total_cash_sum + total_card_sum
            ),
            net: total_card_sum || 0,
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
      {/* <div className={styles.separator}></div>
      <h4>Averages</h4>
      <DataTable
        firstColumnTitle="Order Type"
        secondColumnTitle="Avg no. of items"
        secondColumnSymbol=""
        thirdColumnTitle="Net Avg"
        thirdColumnSymbol="$"
        dataObj={[
          {
            title: "Take Away Order",
            averageItem: calculatePercentage(
              total_cash_sum,
              total_cash_sum + total_card_sum
            ),
            netAvg: total_cash_sum || 0,
          },
          {
            title: "Dine-In Bill",
            averageItem: calculatePercentage(
              total_cash_sum,
              total_cash_sum + total_card_sum
            ),
            netAvg: total_card_tip || 0,
          },
          {
            title: "Online Order",
            averageItem: calculatePercentage(
              total_cash_sum,
              total_cash_sum + total_card_sum
            ),
            netAvg: total_card_tip || 0,
          },
          {
            title: "Dine-In Per Cover",
            averageItem: calculatePercentage(
              500,
              total_cash_sum + total_card_sum
            ),
            netAvg: total_card_tip || 0,
          },
        ]}
        loading={loading}
        customDate={customDate}
        selectedOption={selectedOption}
      /> */}
    </>
  );
};

export default SalesSummary;
