import React from "react";
import styles from "./SalesData.module.scss";

interface SalesDataProps {
  title: string;
  amount: number;
  isDollarAmount: boolean;
}

const SalesData = ({ title, amount, isDollarAmount }: SalesDataProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h3>{title}</h3>
        <h2>{isDollarAmount ? `$${amount}` : `${amount}`}</h2>
      </div>
    </div>
  );
};

export default SalesData;
