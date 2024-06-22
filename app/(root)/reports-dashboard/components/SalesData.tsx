import React, { useEffect, useState } from "react";
import styles from "./SalesData.module.scss";
import SalesDataSkeleton from "./SalesDataSkeleton";

interface SalesDataProps {
  title: string;
  amount: number;
  isDollarAmount: boolean;
  loading: boolean;
}

const SalesData = ({
  title,
  amount,
  isDollarAmount,
  loading,
}: SalesDataProps) => {
  const getDisplayAmount = (amount: number | undefined): number => {
    return isNaN(amount as number) || amount === undefined ? 0 : amount;
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardInfo}>
          <h3>{title}</h3>
          {loading && <SalesDataSkeleton />}
          {!loading && (
            <h2>
              {isDollarAmount
                ? !amount
                  ? `$${getDisplayAmount(amount)}.00`
                  : `$${getDisplayAmount(amount)}`
                : `${getDisplayAmount(amount)}`}
            </h2>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesData;
