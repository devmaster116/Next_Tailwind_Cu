"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
import { formatReadableDate } from "../overview/components/utils/formatDate";
import DataTable from "../overview/components/DataTable";
import { formatTime } from "./utils/formatTime";
import { formatDateToDayOfWeek } from "./utils/formatDateToDayOfWeek";
import withAuth from "@/app/components/Auth/withAuth";
import { Oval } from "react-loader-spinner";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import useWindowSize from "@/app/hooks/useWindowSize";
import Image from "next/image";

const SalesTrends = () => {
  const { width } = useWindowSize();

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

  // console.log("===>", reportStartDate);
  // console.log("===>", reportEndDate);

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
        dineInTakeAwayTotals?.totalDineInOrders &&
        dineInTakeAwayTotals?.totalTakeAwayOrders ? (
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
                aspect={width && width >= 600 ? width / 488 : 4.0 / 3.0}
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
                    stroke="#475467"
                    tickFormatter={
                      isHourlyData ? formatTime : formatDateToDayOfWeek
                    }
                    axisLine={false}
                    tickLine={false}
                    tickMargin={9}
                  />
                  <YAxis
                    tickFormatter={value => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    stroke="#475467"
                  />
                  <Tooltip />
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
                dataObj={[
                  {
                    title: (
                      <>
                        Take Away{" "}
                        <Image
                          className={styles.icon}
                          src="/icons/square-primary-400.svg"
                          height={12}
                          width={12}
                          alt="Square icon"
                        />
                      </>
                    ),
                    takeAway: dineInTakeAwayTotals?.totalTakeAwayOrders || 0,
                    net: dineInTakeAwayTotals?.totalTakeAwayNetSales,
                  },
                  {
                    title: (
                      <>
                        Dine In{" "}
                        <Image
                          className={styles.icon}
                          src="/icons/square-primary-700.svg"
                          height={12}
                          width={12}
                          alt="Square icon"
                        />
                      </>
                    ),
                    dine: dineInTakeAwayTotals?.totalDineInOrders || 0,
                    net: dineInTakeAwayTotals?.totalDineInNetSales,
                  },
                ]}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
                className="salesTrendsTable"
              />
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
