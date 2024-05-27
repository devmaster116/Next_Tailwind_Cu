"use client";
import React, { useState } from "react";
import {
  functions,
  httpsCallable,
} from "@/environments/staging/firebaseConfig";

interface KitchenData {
  kitchen: string;
  kitchenId: string;
  categories: Category[];
}

interface Category {
  category_name: string;
  item_count: number;
  total_price: number;
}

const Statistics = () => {
  const [topCategories, setTopCategories] = useState<Category[]>([]);

  const callAdvancedReporting = async () => {
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
        setTopCategories(getTopCategories(data.categories));
        console.log("top categories ==>", topCategories);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTopCategories = (categories: Category[]): Category[] => {
    return categories
      .sort((a, b) => b.item_count - a.item_count) // Sort by total_price in descending order: ;
      .slice(0, 5); // Get the top 5 categories
  };
  return (
    <div>
      <button onClick={callAdvancedReporting}>Get Advanced Report</button>
      <ul>
        {topCategories.map(category => (
          <li key={category.item_count}>
            {category.category_name}: ${category.total_price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
