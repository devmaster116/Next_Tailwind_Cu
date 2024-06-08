"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../../../components/Auth/withAuth";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";
import { useSearchParams } from "next/navigation";
import {
  Dishes,
  Categories,
  KitchenData,
  OrdersResponse,
} from "@/app/src/types";
import styles from "./Reports.module.scss";
import Skeleton from "./Skeleton";
import SalesData from "./SalesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, getTopFive } from "./utils/formatDate";
import "./DatePicker.scss";

const Reports = () => {
  const searchParams = useSearchParams();
  const kitchenId = searchParams.get("kitchenId");

  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<Categories[]>([]);
  const [topDishes, setTopDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersResponse[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportEndDate, setReportEndDate] = useState(new Date());
  const [reportStartDate, setReportStartDate] = useState(new Date());

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (end !== null && start !== null) {
      setReportStartDate(start);
      setReportEndDate(end);
    }
  };

  useEffect(() => {
    const advancedReports = httpsCallable(functions, "advancedReporting");
    advancedReports({
      kitchenId: kitchenId,
      fromReportDate: formatDate(reportStartDate),
      toReportDate: formatDate(reportEndDate),
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;

        const topCategories = getTopFive(data.categories) as Categories[];
        setTopCategories(topCategories);

        const topDishes = getTopFive(data.dishes) as Dishes[];
        setTopDishes(topDishes);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });

    const overviewReports = httpsCallable(functions, "overviewReportFunction");
    overviewReports({
      kitchenId: kitchenId,
      fromReportDate: formatDate(reportStartDate),
      toReportDate: formatDate(reportEndDate),
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;
        console.log("data response ==>", data.response);
        setOrdersData(data.response);
      })
      .catch(error => {
        console.log("Failed to fetch overview reports", error);
      });
  }, [reportEndDate]);

  const {
    total_net_sales,
    total_orders,
    total_refunded_sum,
    total_refunded_orders,
  } = ordersData[0] || {};
  return (
    <>
      <div className="customDatePickerWrapper">
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          calendarStartDay={1}
        />
      </div>
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
            (total_net_sales / (total_orders - total_refunded_orders)).toFixed(
              2
            )
          )}
          isDollarAmount={true}
          loading={loading}
        />
        <SalesData
          title="Refunds"
          amount={total_refunded_sum}
          isDollarAmount={true}
          loading={loading}
        />
      </div>
      <div className={styles.report}>
        <div className={styles.reportHeader}>
          <div
            className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
          >
            Top 5 Categories
          </div>
          <div className={`${styles.reportItem} ${styles.countHeading}`}>
            Count
          </div>
          <div className={styles.headerItem}>Gross</div>{" "}
        </div>
        {loading && <Skeleton />}
        {!loading && (
          <div className={styles.reportBody}>
            {topCategories.map((category, i) => (
              <div key={i} className={styles.reportRow}>
                <div
                  className={`${styles.reportItem} ${styles.reportItemName}`}
                >
                  {category.category_name}
                </div>
                <div className={styles.reportItem}>{category.item_count}</div>
                <div className={styles.reportItem}>${category.total_price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.report}>
        <div className={styles.reportHeader}>
          <div
            className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
          >
            Top 5 Items
          </div>
          <div className={`${styles.reportItem} ${styles.countHeading}`}>
            Count
          </div>
          <div className={styles.headerItem}>Gross</div>
        </div>
        {loading && <Skeleton />}
        {!loading && (
          <div className={styles.reportBody}>
            {topDishes.map((dish, i) => (
              <div key={i} className={styles.reportRow}>
                <div
                  className={`${styles.reportItem} ${styles.reportItemName}`}
                >
                  {dish.dish_name}
                </div>
                <div className={styles.reportItem}>{dish.item_count}</div>
                <div className={styles.reportItem}>${dish.total_price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(Reports);
