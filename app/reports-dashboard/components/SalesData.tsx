import React from "react";
import styles from "./SalesData.module.scss";

interface SalesDataProps {
  title: string;
  amount: number;
}

const SalesData = ({ title, amount }: SalesDataProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h3>{title}</h3>
        <h2>{amount}</h2>
      </div>
    </div>
  );
};

export default SalesData;
