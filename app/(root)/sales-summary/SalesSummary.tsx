"use client";
import React, { useEffect, useState } from "react";
import styles from "./SalesSummary.module.scss";
import { functions, httpsCallable } from "@/firebase/config";
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
import useWindowSize from "@/app/hooks/useWindowSize";

const SalesSummary = () => {
  const [kitchenId, setKitchenId] = useState<string>("defaultKitchenId");
  const [overviewReportFunctionError, setOverviewReportFunctionError] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<OrdersResponse[]>([]);
  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());
  const [customDate, setCustomDate] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>("Today");
  const { width } = useWindowSize();
    
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

  console.log("==>", reportsData);

  const calculatePercentage = (
    numerator: number,
    denominator: number,
    fixedTo?: number
  ): string => {
    if (denominator === 0) {
      return "0.00";
    }

    return ((numerator / denominator) * 100).toFixed(fixedTo ?? 2);
  };

  const {
    dine_in_order_net_avg,
    online_order_net_avg,
    take_away_order_net_avg,
    total_card_orders,
    total_card_refunded_sum,
    total_card_sum,
    total_card_surcharge,
    total_card_tip,
    total_cash_orders,
    total_cash_refunded_sum,
    total_cash_sum,
    total_completed_orders,
    total_dine_in_orders,
    total_holiday_surcharge,
    total_net_sales,
    total_online_orders,
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
      {width && width >= 600 && (
        <h1 className={styles.pageTitle}>Sales Summary</h1>
      )}
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
        fontSize={width && width >= 600 ? "18px" : "16px"}
        dataObj={[
          {
            title: "Take Away",
            takeAway: `${total_take_away_orders || 0}  (${calculatePercentage(
              total_take_away_orders,
              total_take_away_orders + total_dine_in_orders || 0,
              1
            )}%)`,
            net: take_away_order_net_avg || 0,
          },
          {
            title: "Dine In",
            dine: `${total_dine_in_orders || 0}  (${calculatePercentage(
              total_dine_in_orders,
              total_take_away_orders + total_dine_in_orders || 0,
              1
            )}%)`,
            net: dine_in_order_net_avg || 0,
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
        fontSize={width && width >= 600 ? "18px" : "16px"}
        dataObj={[
          {
            title: "Cash",
            percentage: `${total_cash_orders || 0}  (${calculatePercentage(
              total_cash_sum,
              total_cash_sum + total_card_sum || 0,
              1
            )}%)`,
            net: total_cash_sum || 0,
          },
          {
            title: "Card",
            percentage: `${total_card_orders || 0}  (${calculatePercentage(
              total_card_sum,
              total_cash_sum + total_card_sum || 0,
              1
            )}%)`,
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
        fontSize={width && width >= 600 ? "18px" : "16px"}
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
        fontSize={width && width >= 600 ? "18px" : "16px"}
        dataObj={[
          {
            title: "Take Away Order",
            averageItem: total_take_away_orders || 0,
            netAvg: take_away_order_net_avg || 0,
          },
          {
            title: "Dine-in Order",
            averageItem: total_dine_in_orders || 0,
            netAvg: dine_in_order_net_avg || 0,
          },
          {
            title: "Online Order",
            averageItem: total_online_orders || 0,
            netAvg: online_order_net_avg || 0,
          },
        ]}
        loading={loading}
        customDate={customDate}
        selectedOption={selectedOption}
      />
    </>
  );
};

export default SalesSummary;
