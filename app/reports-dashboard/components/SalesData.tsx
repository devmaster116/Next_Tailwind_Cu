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
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardInfo}>
          <h3>{title}</h3>
          {loading && <SalesDataSkeleton />}
          {!loading && <h2>{isDollarAmount ? `$${amount}` : `${amount}`}</h2>}
        </div>
      </div>
    </>
  );
};

export default SalesData;
