"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useReportDate } from "@/app/context/ReportDateContext";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal, {
  DateRangeOptions,
} from "../overview/components/utils/DateRangeSelectorModal";
import "../overview/components/DatePicker.scss";
import { useKitchen } from "@/app/context/KitchenContext";
import styles from "./SalesTrends.module.scss";
import useFetchSalesTrendsData from "@/app/hooks/useFetchSalesTrendsData";
import {
  convertToFullDate,
  formatReadableDate,
} from "../overview/components/utils/formatDate";
import DataTable from "../overview/components/DataTable";
import { formatTime } from "./utils/formatTime";
import { formatDateToDayOfWeek } from "./utils/formatDateToDayOfWeek";
import withAuth from "@/app/components/Auth/withAuth";
import { Oval } from "react-loader-spinner";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import useWindowSize from "@/app/hooks/useWindowSize";
import Image from "next/image";
import { OrderMultiDayData, Totals } from "@/app/src/types";
import { formatDateToDayOfWeekWithDate } from "./utils/formatDateToDayOfWeekWithDate";
import { getEvenlySpacedDates } from "./utils/getEvenlySpacedDates";

const SalesTrends = () => {
  // const { width } = useWindowSize();

  const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), {
    ssr: false,
  });
  const { kitchen } = useKitchen();
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
    hourlyDataForTakeAwayAndDineIn,
    multiDayDataForTakeAwayAndDineIn,
    dineInTakeAwayTotals,
    loading,
  } = useFetchSalesTrendsData(
    kitchenId,
    selectedOption,
    reportStartDate,
    reportEndDate,
    previousReportStartDateRef,
    previousReportEndDateRef
  );

  const { customDate, setCustomDate } = useFetchReports(
    kitchenId,
    selectedOption,
    reportStartDate,
    reportEndDate,
    previousReportStartDateRef,
    previousReportEndDateRef,
    true
  );

  const isHourlyData =
    reportStartDate === reportEndDate ||
    selectedOption === DateRangeOptions.Today;

  const data = isHourlyData
    ? hourlyDataForTakeAwayAndDineIn
    : multiDayDataForTakeAwayAndDineIn;

  const transformedData = data?.map(item => ({
    ...item,
    "Dine In Sales": item.total_dine_in_net_sales,
    "Take Away Sales": item.total_take_away_net_sales,
  }));

  const {
    totalTakeAwayOrders,
    totalDineInOrders,
    totalTakeAwayNetSales,
    totalDineInNetSales,
  } = (dineInTakeAwayTotals as Totals) || {};

  const evenlySpacedDates =
    !isHourlyData && transformedData && transformedData.length > 10
      ? getEvenlySpacedDates(transformedData as OrderMultiDayData[], 8)
      : [];
  return (
    <div>
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
      <h1 className={styles.pageTitle}>Sales Trends</h1>
      {!loading ? (
        totalDineInOrders || totalTakeAwayOrders ? (
          <div className={styles.salesDataContainer}>
            <div className={styles.chartTitle}>
              <h3>{isHourlyData ? "Hourly" : "Daily"} Sales Trend</h3>
              <h4>
                {isHourlyData
                  ? formatReadableDate(reportStartDate)
                  : `(${formatReadableDate(
                      reportStartDate
                    )} - ${formatReadableDate(reportEndDate)})`}
              </h4>
            </div>

            <div className={styles.barChart}>
              <ResponsiveContainer
                width="100%"
                className={styles.chartContainer}
              >
                <BarChart
                  id=""
                  data={transformedData}
                  margin={{
                    top: 35,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid stroke="#F2F4F7" vertical={false} />
                  <XAxis
                    dataKey={`${
                      isHourlyData ? "order_hour" : "order_date.value"
                    }`}
                    stroke="#344054"
                    tickFormatter={
                      isHourlyData
                        ? formatTime
                        : evenlySpacedDates.length > 0
                        ? formatDateToDayOfWeekWithDate
                        : formatDateToDayOfWeek
                    }
                    axisLine={false}
                    tickLine={false}
                    tickMargin={9}
                    {...(evenlySpacedDates.length > 0
                      ? { ticks: evenlySpacedDates }
                      : {})}
                    fontSize={14}
                  />
                  <YAxis
                    tickFormatter={value => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    stroke="#475467"
                    fontSize={14}
                  />
                  <Tooltip
                    formatter={value => `$${value}`}
                    labelFormatter={value =>
                      isHourlyData
                        ? formatTime(value)
                        : `${formatReadableDate(convertToFullDate(value))}`
                    }
                  />
                  <Bar
                    dataKey="Take Away Sales"
                    stackId="a"
                    fill="#9E77ED"
                    barSize={32}
                  />
                  <Bar
                    dataKey="Dine In Sales"
                    stackId="a"
                    fill="#6C01CC"
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
              <DataTable
                firstColumnTitle="Order Type"
                secondColumnTitle="Count"
                thirdColumnTitle="Net Total"
                thirdColumnSymbol="$"
                className="salesTrendsTable"
                dataObj={[
                  {
                    title: (
                      <>
                        Take Away
                        <Image
                          src="/icons/square-primary-400.svg"
                          height={12}
                          width={12}
                          alt="Square icon"
                        />
                      </>
                    ),
                    takeAway: totalTakeAwayOrders || 0,
                    net: totalTakeAwayNetSales,
                  },
                  {
                    title: (
                      <>
                        Dine In
                        <Image
                          className={styles.icon}
                          src="/icons/square-primary-700.svg"
                          height={12}
                          width={12}
                          alt="Square icon"
                        />
                      </>
                    ),
                    dine: totalDineInOrders || 0,
                    net: totalDineInNetSales,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
              />
            </div>
            <div className={styles.totalsRow}>
              <div className={styles.emptyColumn}></div>
              <div className={styles.countTotalColumn}>
                {totalDineInOrders + totalTakeAwayOrders}
              </div>
              <div className={styles.netTotalColumn}>
                {`$${(totalDineInNetSales + totalTakeAwayNetSales).toFixed(2)}`}
              </div>
            </div>
          </div>
        ) : (
          <NoSalesMessage
            message="No sales in selected period"
            messageDescription={`${
              customDate
                ? `between ${customDate}`
                : `No sale completed ${selectedOption?.toLowerCase()}.`
            }`}
          />
        )
      ) : (
        <Oval
          height={80}
          width={80}
          color="#6c01cc"
          wrapperStyle={{}}
          wrapperClass={styles.spinner}
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#8600ff"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      )}
    </div>
  );
};

export default withAuth(SalesTrends);
