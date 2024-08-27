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

const SalesTrends = () => {
  const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), {
    ssr: false,
  });

  const formatTime = (value: string) => {
    const hours = Number(value) % 24;
    const period = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}${period}`;
  };

  const formatDateToDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = { weekday: "short" };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;
  console.log("Kitchen ID ==>", kitchenId);

  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
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
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  const isHourlyData =
    reportStartDate === reportEndDate ||
    selectedOption === DateRangeOptions.Today;

  const { salesData } = useFetchSalesTrendsData(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  const { hourlyDataForTakeAwayAndDineIn, multiDayDataForTakeAwayAndDineIn } =
    salesData?.data || {};
  const data = isHourlyData
    ? hourlyDataForTakeAwayAndDineIn
    : multiDayDataForTakeAwayAndDineIn;

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
      <div className={styles.barChart}>
        <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
          <BarChart
            id=""
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="#F2F4F7" vertical={false} />
            <XAxis
              dataKey={`${isHourlyData ? "order_hour" : "order_date.value"}`}
              stroke="#475467"
              tickFormatter={isHourlyData ? formatTime : formatDateToDayOfWeek}
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
              dataKey="total_take_away_net_sales"
              stackId="a"
              fill="#9E77ED"
            />
            <Bar dataKey="total_dine_in_net_sales" stackId="a" fill="#6C01CC" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrends;
