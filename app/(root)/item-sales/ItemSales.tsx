"use client";
import React, { useEffect, useState } from "react";
import styles from "./ItemSales.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import withAuth from "@/app/components/Auth/withAuth";
import useFetchReports from "@/app/hooks/useFetchReports";
import DateRangeSelectorModal from "../overview/components/utils/DateRangeSelectorModal";
import { useKitchen } from "@/app/context/KitchenContext";
import DataError from "../overview/components/DataError";
import SalesData from "../overview/components/SalesData";
import {
  Dishes,
  ModifierItemInsightsData,
  SelectedVariantsForDishData,
} from "@/app/src/types";
import DataTable from "../overview/components/DataTable";
import "../overview/components/DatePicker.scss";
import { getDishStats } from "./utils/commonUtils";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import { useReportDate } from "@/app/context/ReportDateContext";
import { removeGst } from "@/app/components/Auth/utils/helper";

const ItemSales = () => {
  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
  } = useReportDate();

  const { ordersData } = useReportDataContext();
  const total_net_sales = ordersData?.[0]?.total_net_sales || 0;

  const [noSales, setNoSales] = useState<boolean>(false);
  const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
  const [dishName, setDishName] = useState<string>("");
  const [totalModifierCount, setTotalModifierCount] = useState<number>(0);
  const [matchedDishes, setMatchedDishes] = useState<
    ModifierItemInsightsData[]
  >([]);

  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;

  const {
    loading,
    error,
    customDate,
    setCustomDate,
    allDishes,
    advancedReportingError,
    selectedVariants,
  } = useFetchReports(
    kitchenId,
    reportStartDate,
    reportEndDate,
    selectedOption
  );

  const [dishStats, setDishesStats] = useState<{
    mostPopular: Dishes | null;
    highestNetSale: Dishes | null;
  }>({
    mostPopular: null,
    highestNetSale: null,
  });

  console.log("selected guy ==>", selectedVariants);
  console.log("all dishes==>", allDishes);

  const handleRowClick = (dishName: any) => {
    // Set matched dishes based on dishName
    const matchedDishes = getMatchingDishes(dishName, selectedVariants);
    setMatchedDishes(
      matchedDishes.map(dish => ({
        ...dish,
        variantCombination:
          dish.variantCombination === "" ? "Regular" : dish.variantCombination,
      }))
    );

    // Calculate and set the total modifier count
    const totalCount = getTotalModifierCount(matchedDishes);
    setTotalModifierCount(totalCount);

    // Set dish name and open the modal, but wait until the other states are set
    setDishName(dishName);
  };

  const getMatchingDishes = (
    dishName: string,
    dishes: SelectedVariantsForDishData[]
  ): ModifierItemInsightsData[] => {
    return dishes
      .filter(dish => dish.dishName === dishName)
      .map(({ dishName, category, ...rest }) => rest);
  };

  console.log(" matchedDishes====>", matchedDishes);
  console.log(" totalModifierCount====>", totalModifierCount);

  function getTotalModifierCount(dishes: ModifierItemInsightsData[]): number {
    return dishes.reduce((total, dish) => total + dish.count, 0);
  }

  useEffect(() => {
    console.log("hello 1");
    if (dishName && totalModifierCount >= 0) {
      console.log("dishname total", dishName, totalModifierCount);
      setIsModifiersModalOpen(true);
    }
  }, [dishName, totalModifierCount, matchedDishes]);

  useEffect(() => {
    if (loading) {
      setNoSales(false);
      setDishesStats({
        mostPopular: null,
        highestNetSale: null,
      });
    } else {
      if (allDishes && allDishes.length > 0) {
        setNoSales(false);
        try {
          const stats = getDishStats(allDishes);
          setDishesStats(stats);
        } catch (error) {
          console.error("Error getting dish stats:", error);
        }
      } else {
        setDishesStats({
          mostPopular: null,
          highestNetSale: null,
        });
        setNoSales(true);
      }
    }
  }, [loading, allDishes]);

  console.log("ALL DISHES +=====>", allDishes);

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
      <h1 className={styles.pageTitle}>Item Sales</h1>
      {error ? (
        <>
          <DataError
            errorMessage="Error retrieving item sales data"
            errorDescription="Check your connectivity and try again."
          />
        </>
      ) : (
        <>
          {advancedReportingError ? (
            <DataError errorMessage="Error retrieving item data" />
          ) : !noSales ? (
            <>
              <ModifiersModal
                title="Item Insights"
                dishName={dishName}
                netSales={total_net_sales}
                show={isModifiersModalOpen}
                onClose={() => setIsModifiersModalOpen(false)}
                customDate={customDate}
                selectedOption={selectedOption}
                totalModifierCount={totalModifierCount}
                numberOfModifiers={matchedDishes.length}
                modifiersForDish={matchedDishes}
              />

              <div className={styles.salesDataContainer}>
                <SalesData
                  title="Most Popular"
                  item={dishStats.mostPopular?.dish_name}
                  isDollarAmount={false}
                  loading={loading}
                />
                <SalesData
                  title="Highest Net Sale"
                  item={dishStats.highestNetSale?.dish_name}
                  isDollarAmount={false}
                  loading={loading}
                />
              </div>

              <DataTable
                firstColumnTitle="Item Name"
                secondColumnTitle="Count"
                thirdColumnTitle="Net"
                secondColumnSymbol=""
                thirdColumnSymbol="$"
                dataObj={removeGst(allDishes)}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
                onRowClick={handleRowClick}
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

export default withAuth(ItemSales);
