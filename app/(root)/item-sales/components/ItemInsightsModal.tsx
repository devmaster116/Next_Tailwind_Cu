import React, { MouseEventHandler, useState } from "react";
import styles from "./ItemInsightsModal.module.scss";
import Image from "next/image";
import ItemSalesData from "./ItemSalesData";
import DataTable from "../../overview/components/DataTable";
import { ItemInsightsData, DishVariationTotals } from "@/app/src/types";
import { removeGst } from "@/app/components/Auth/utils/helper";
import { formatRoundUp } from "../../overview/components/utils/formatRoundUp";
import { filterProperties } from "../utils/filterProperties";

const ItemInsightsModal = ({
  show,
  title,
  dishName,
  customDate,
  selectedOption,
  totalDishVariantCount,
  numberOfVariants,
  uniqueVariations,
  onClose,
}: {
  show: boolean;
  title: string | null;
  dishName: string;
  cancelButtonText?: string;
  customDate: string | undefined;
  selectedOption: string;
  totalDishVariantCount: DishVariationTotals;
  numberOfVariants: number;
  uniqueVariations: ItemInsightsData[];
  onClose: MouseEventHandler;
}) => {
  if (!show) {
    return null;
  }
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modal} ${isExiting ? styles.exit : ""}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.headerContent}>
          <button className={styles.closeButton} onClick={handleClose}>
            <Image
              className={styles.icon}
              src="/icons/x-close.svg"
              height={12}
              width={12}
              alt="Close icon"
            />
          </button>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.dishName}>
          <h2 className={styles.category}>{`${
            uniqueVariations[0]?.category ?? 0
          } / `}</h2>
          <h2>{dishName}</h2>
        </div>
        <div className={styles.salesData}>
          <ItemSalesData
            title="Net Sales"
            amount={formatRoundUp(totalDishVariantCount.totalPriceWithVariants).toString()}
            symbol="$"
          />
          <ItemSalesData
            title="Time Frame"
            amount={customDate ? customDate : selectedOption}
          />
          <ItemSalesData
            title="Sold Count"
            amount={totalDishVariantCount.totalQuantity.toString()}
          />
          <ItemSalesData
            title="Unique Variations"
            amount={numberOfVariants.toString()}
          />
        </div>
        {uniqueVariations && (
          <DataTable
            firstColumnTitle="Modifiers"
            secondColumnTitle="Count"
            thirdColumnTitle="Net"
            thirdColumnSymbol="$"
            dataObj={filterProperties(
              removeGst(uniqueVariations, "totalPriceWithVariants")
            )}
            className="dataInsightsTable"
          />
        )}
      </div>
    </div>
  );
};

export default ItemInsightsModal;
