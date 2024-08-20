import React from "react";
import styles from "./ItemSalesData.module.scss";

interface ItemSalesDataProps {
  title: string;
  amount: string | number;
  symbol?: string;
}

const ItemSalesData = ({ title, amount, symbol }: ItemSalesDataProps) => {
  return (
    <div className={`${styles.card} ${styles[title.split(" ").join("")]}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.amount}>
        {symbol}
        {amount}
      </div>
    </div>
  );
};

export default ItemSalesData;
