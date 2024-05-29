"use client";
import React, { useEffect, useState } from "react";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";
import { Dishes, Categories, KitchenData, KitchenItem } from "@/app/src/types";
import styles from "./Reports.module.scss";
import Skeleton from "./Skeleton";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<Categories[]>([]);
  const [topDishes, setTopDishes] = useState<Dishes[]>([]);

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
        console.log("kitchen ==>", data);
        const topCategories = getTopFive(data.categories) as Categories[];
        setTopCategories(topCategories);

        // Get top dishes
        const topDishes = getTopFive(data.dishes) as Dishes[];
        setTopDishes(topDishes);
        setLoading(false);
        console.log("top categories ==>", topCategories);
      })
      .catch(error => {
        console.log("Failed to fetch advanced reports", error);
        setLoading(false);
      });
  }, []);

  const getTopFive = (items: KitchenItem[]): KitchenItem[] => {
    const sortedItems = items.sort((a, b) => b.item_count - a.item_count);
    return sortedItems.slice(0, 5);
  };
  return (
    <>
      {!loading && (
        <>
          <div className={styles.report}>
            <div className={styles.reportHeader}>
              <div
                className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
              >
                Top 5 Categories
              </div>
              <div className={styles.headerItem}>Count</div>
              <div className={styles.headerItem}>Gross</div>
            </div>
            <div className={styles.reportBody}>
              {topCategories.map((category, i) => (
                <div key={i} className={styles.reportRow}>
                  <div
                    className={`${styles.reportItem} ${styles.reportItemName}`}
                  >
                    {category.category_name}
                  </div>
                  <div className={styles.reportItem}>{category.item_count}</div>
                  <div className={styles.reportItem}>
                    ${category.total_price}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.report}>
            <div className={styles.reportHeader}>
              <div
                className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
              >
                Top 5 Items
              </div>
              <div className={styles.headerItem}>Count</div>
              <div className={styles.headerItem}>Gross</div>
            </div>
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
          </div>
        </>
      )}
      {loading && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}
    </>
  );
};

export default Reports;
