"use client";
import React, { useEffect, useState } from "react";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";
import {
  Dishes,
  Categories,
  KitchenData,
  KitchenItem,
  OrdersResponse,
} from "@/app/src/types";
import styles from "./Reports.module.scss";
import Skeleton from "./Skeleton";
import SalesData from "./SalesData";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<Categories[]>([]);
  const [topDishes, setTopDishes] = useState<Dishes[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersResponse[]>([]);

  useEffect(() => {
    const advancedReports = httpsCallable(functions, "advancedReporting");
    advancedReports({
      kitchenId: "73stfjzxk3ocfxvqxnrhhcflhtet",
      fromReportDate: "2024-01-01",
      toReportDate: "2025-01-01",
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
      kitchenId: "73stfjzxk3ocfxvqxnrhhcflhtet",
      fromReportDate: "2024-01-01",
      toReportDate: "2025-01-01",
    })
      .then(result => {
        /** @type {any} */
        const data = result.data as KitchenData;

        setOrdersData(data.response);
      })
      .catch(error => {
        console.log("Failed to fetch overview reports", error);
      });
  }, []);

  const getTopFive = (items: KitchenItem[]): KitchenItem[] => {
    const sortedItems = items.sort((a, b) => b.item_count - a.item_count);
    return sortedItems.slice(0, 5);
  };

  const {
    total_net_sales,
    total_orders,
    total_refunded_sum,
    total_refunded_orders,
  } = ordersData[0] || {};
  return (
    <>
      <div className={styles.salesDataContainer}>
        <SalesData
          title="Net Sales"
          amount={total_net_sales}
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

export default Reports;
