import React, { useEffect, useState } from "react";
import styles from "./SalesData.module.scss";
import SalesDataSkeleton from "./SalesDataSkeleton";
import { formatRoundUp } from "./utils/formatRoundUp";

interface SalesDataProps {
  title: string;
  amount?: number;
  item?: string;
  secondAmount?: number;
  isDollarAmount?: boolean;
  isPercentage?: boolean;
  loading?: boolean;
  wholeNumber?: boolean;
}

const SalesData = ({
  title,
  amount,
  item,
  secondAmount,
  isDollarAmount = false,
  isPercentage = false,
  loading,
  wholeNumber = false,
}: SalesDataProps) => {
  const getDisplayAmount = (amount: number | undefined): string | 0 => {
    return isNaN(amount as number) || amount === undefined
      ? 0
      : formatRoundUp(amount);
  };

  function formatAmount(amount: number | undefined) {
    const safeAmount = amount ?? 0;
    let displayAmount = "0";

    if (isDollarAmount) {
      return safeAmount ? `$${getDisplayAmount(safeAmount)}` : "$0";
    }

    if (isPercentage) {
      const formattedAmount = Number(getDisplayAmount(safeAmount)).toFixed(1);

      return `${formattedAmount}%`;
    }

    if (wholeNumber) {
      displayAmount = safeAmount.toString();
    }

    return displayAmount;
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardInfo}>
          <h3>{title}</h3>
          {loading && <SalesDataSkeleton />}
          {!loading && (
            <div className={styles.cardInfoAmount}>
              <p>
                {amount || amount === 0 || Number.isNaN(amount)
                  ? formatAmount(amount)
                  : item}
              </p>
              {secondAmount !== undefined && secondAmount !== null && (
                <>
                  <span>/</span>
                  <p>{formatAmount(secondAmount)}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesData;
