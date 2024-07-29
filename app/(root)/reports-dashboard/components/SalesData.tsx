import React, { useEffect, useState } from "react";
import styles from "./SalesData.module.scss";
import SalesDataSkeleton from "./SalesDataSkeleton";

interface SalesDataProps {
  title: string;
  amount?: number;
  item?: string;
  secondAmount?: number;
  isDollarAmount?: boolean;
  isPercentage?: boolean;
  loading: boolean;
}

const SalesData = ({
  title,
  amount,
  item,
  secondAmount,
  isDollarAmount = false,
  isPercentage = false,
  loading,
}: SalesDataProps) => {
  const getDisplayAmount = (amount: number | undefined): number => {
    return isNaN(amount as number) || amount === undefined ? 0 : amount;
  };

  function formatAmount(amount: number | undefined) {
    const safeAmount = amount ?? 0;
    if (isDollarAmount) {
      return safeAmount ? `$${getDisplayAmount(safeAmount).toFixed(2)}` : "$0";
    }

    if (isPercentage) {
      return `${getDisplayAmount(safeAmount * 100)}%`;
    }

    return getDisplayAmount(safeAmount);
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
