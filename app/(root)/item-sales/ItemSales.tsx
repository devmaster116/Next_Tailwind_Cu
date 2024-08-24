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
  ItemInsightsData,
  SelectedVariantsForDishData,
  DishVariationTotals,
} from "@/app/src/types";
import DataTable from "../overview/components/DataTable";
import "../overview/components/DatePicker.scss";
import { getDishStats } from "./utils/commonUtils";
import NoSalesMessage from "../overview/components/NoSalesMessage";
import { useReportDate } from "@/app/context/ReportDateContext";
import { removeGst } from "@/app/components/Auth/utils/helper";
import ItemInsightsModal from "./components/ItemInsightsModal";

const ItemSales = () => {
  const {
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    selectedOption,
    setSelectedOption,
  } = useReportDate();

  const [noSales, setNoSales] = useState<boolean>(false);
  const [isItemInsightsModalOpen, setIsItemInsightsModalOpen] = useState(false);
  const [dishName, setDishName] = useState<string>("");
  const [totalDishVariantCount, setTotalDishVariantCount] =
    useState<DishVariationTotals>();
  const [matchedDishes, setMatchedDishes] = useState<ItemInsightsData[]>([]);

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

  const handleRowClick = (dishName: any) => {
    const matchedDishes = getMatchingDishes(dishName, selectedVariants);

    setMatchedDishes(
      matchedDishes.map(dish => ({
        ...dish,
        variantCombination:
          dish.variantCombination === "" ? "Regular" : dish.variantCombination,
      }))
    );

    // const totalCount = getTotalsForDishVariations(
    //   removeGst(matchedDishes, "totalPriceWithVariants")
    // ) || {
    //   totalQuantity: 0,
    //   totalPriceWithVariants: 0,
    // };

    // setTotalDishVariantCount(totalCount);
    // setDishName(dishName);
  };

  const getMatchingDishes = (
    dishName: string,
    dishes: SelectedVariantsForDishData[]
  ): ItemInsightsData[] => {
    return dishes
      .filter(dish => dish.dishName === dishName)
      .map(({ dishName, ...rest }) => rest);
  };

  function getTotalsForDishVariations(
    dishes: ItemInsightsData[] = []
  ): DishVariationTotals {
    if (dishes.length === 0) {
      return { totalQuantity: 0, totalPriceWithVariants: 0 };
    }

    return dishes.reduce(
      (acc, dish) => {
        acc.totalQuantity += dish.total_quantity;
        acc.totalPriceWithVariants += dish.totalPriceWithVariants;
        return acc;
      },
      { totalQuantity: 0, totalPriceWithVariants: 0 }
    );
  }

  useEffect(() => {
    if (dishName) {
      setIsItemInsightsModalOpen(true);
    }
  }, [dishName, totalDishVariantCount, matchedDishes]);

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
              <ItemInsightsModal
                title="Item Insights"
                dishName={dishName}
                show={isItemInsightsModalOpen}
                onClose={() => setIsItemInsightsModalOpen(false)}
                customDate={customDate}
                selectedOption={selectedOption}
                totalDishVariantCount={
                  totalDishVariantCount ?? {
                    totalPriceWithVariants: 0,
                    totalQuantity: 0,
                  }
                }
                numberOfVariants={matchedDishes.length}
                uniqueVariations={matchedDishes}
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

              {/* <DataTable
                firstColumnTitle="Item Name"
                secondColumnTitle="Count"
                thirdColumnTitle="Net"
                secondColumnSymbol=""
                thirdColumnSymbol="$"
                dataObj={removeGst(allDishes, "total_price")}
                loading={loading}
                customDate={customDate}
                selectedOption={selectedOption}
                onRowClick={handleRowClick}
              /> */}
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
