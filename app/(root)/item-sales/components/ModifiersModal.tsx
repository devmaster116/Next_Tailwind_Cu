import React, { MouseEventHandler } from "react";
import styles from "./ModifiersModal.module.scss";
import Image from "next/image";
import ItemSalesData from "./ItemSalesData";
import DataTable from "../../overview/components/DataTable";
import { ModifierItemInsightsData, TotalsModifier } from "@/app/src/types";

const ModifiersModal = ({
  show,
  onClose,
  title,
  dishName,
  customDate,
  selectedOption,
  totalModifierCount,
  numberOfModifiers,
  modifiersForDish,
}: {
  show: boolean;
  onClose: MouseEventHandler;
  title: string | null;
  dishName: string;
  cancelButtonText?: string;
  customDate: string | undefined;
  selectedOption: string;
  totalModifierCount: TotalsModifier;
  numberOfModifiers: number;
  modifiersForDish: ModifierItemInsightsData[];
}) => {
  if (!show) {
    return null;
  }

  function removeCategory(
    modifiersForDish: { [x: string]: any; category: any }[]
  ) {
    return modifiersForDish.map(({ category, ...rest }) => rest);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.headerContent}>
          <button className={styles.closeButton} onClick={onClose}>
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
            modifiersForDish[0]?.category ?? 0
          } / `}</h2>
          <h2>{dishName}</h2>
        </div>
        <div className={styles.salesData}>
          <ItemSalesData
            title="Net Sales"
            amount={totalModifierCount.totalPriceWithVariants.toString()}
            symbol="$"
          />
          <ItemSalesData
            title="Highest Net Sale"
            amount={customDate ? customDate : selectedOption}
          />
          <ItemSalesData
            title="Sold Count"
            amount={totalModifierCount.totalQuantity.toString()}
          />
          <ItemSalesData
            title="Variation"
            amount={numberOfModifiers.toString()}
          />
        </div>
        {modifiersForDish && (
          <DataTable
            firstColumnTitle="Modifiers"
            secondColumnTitle="Count"
            thirdColumnTitle="Net"
            thirdColumnSymbol="$"
            dataObj={removeCategory(modifiersForDish)}
          />
        )}
      </div>
    </div>
  );
};

export default ModifiersModal;
