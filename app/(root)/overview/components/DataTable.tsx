import React from "react";
import styles from "./DataTable.module.scss";
import Skeleton from "./Skeleton";
import Image from "next/image";
import { formatRoundUp } from "./utils/formatRoundUp";

type TableRowClickHandler = (rowData: any) => void;

interface DataTableProps {
  dataObj: Array<Record<string, any>>;
  firstColumnTitle: string;
  secondColumnTitle: string | number;
  thirdColumnTitle?: string;
  secondColumnSymbol?: string;
  thirdColumnSymbol?: string;
  loading?: boolean;
  customDate?: string;
  selectedOption?: string;
  negative?: boolean;
  hideRow?: boolean;
  onRowClick?: TableRowClickHandler;
  className?: string;
  isSecondColumnNumber?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  dataObj,
  firstColumnTitle,
  secondColumnTitle,
  thirdColumnTitle,
  secondColumnSymbol,
  thirdColumnSymbol,
  loading,
  customDate,
  selectedOption,
  negative = false,
  hideRow = false,
  onRowClick,
  className,
  isSecondColumnNumber = false
}) => {
  return (
    <div
      className={`${styles.report} ${
        firstColumnTitle === "Net Sales" ? styles.netSalesReport : ""
      } ${firstColumnTitle === "Gross Sales" ? styles.grossSalesReport : ""} ${
        className && styles[className] ? styles[className] : ""
      }`}
    >
      <div className={styles.reportHeader}>
        <div
          className={`${styles.headerItem} ${styles.headerItemTopCategories}`}
        >
          {firstColumnTitle}
        </div>
        {secondColumnTitle && isSecondColumnNumber && (
          <div className={`${styles.headerItemCenter} ${styles.countHeading}`}>
            ${Number((Math.ceil(Number(secondColumnTitle) * 100) / 100).toFixed(2)).toLocaleString()}
          </div>
        )}
        {secondColumnTitle && !isSecondColumnNumber && (
          <div className={`${styles.headerItemCenter} ${styles.countHeading}`}>
            {secondColumnTitle}
          </div>
        )}
        {thirdColumnTitle && (
          <div className={styles.headerItem}>{thirdColumnTitle}</div>
        )}
      </div>
      {loading && <Skeleton />}
      {!loading && (
        <div className={styles.reportBody}>
          {dataObj.length === 0 ? (
            <div className={styles.reportRow}>
              <div className={`${styles.reportItem} ${styles.reportItemName}`}>
                <p className={styles.noDataText}>
                  No sale completed{" "}
                  {customDate
                    ? `between ${customDate}`
                    : selectedOption?.toLowerCase()}
                </p>
              </div>
            </div>
          ) : (
            dataObj.map((item, i) =>
              hideRow && !item[Object.keys(item)[1]] ? (
                <div></div>
              ) : (
                <div
                  key={i}
                  className={`${styles.reportRow} ${
                    onRowClick && styles.isClickable
                  }`}
                  onClick={() =>
                    onRowClick && onRowClick(item[Object.keys(item)[0]])
                  }
                >
                  <div
                    className={`${styles.reportItem} ${styles.reportItemName}`}
                  >
                    {item[Object.keys(item)[0]]}
                  </div>
                  <div className={`${styles.reportItem}`}>
                    {secondColumnSymbol === "$" ? (
                      <>
                        {negative && "("}
                        {secondColumnSymbol}
                        {item[Object.keys(item)[1]]
                            ? formatRoundUp(item[Object.keys(item)[1]])
                            : 0}
                        {negative && ")"}
                      </>
                    ) : (
                      <>
                        {item[Object.keys(item)[1]]}
                        {secondColumnSymbol}
                      </>
                    )}
                  </div>
                  {thirdColumnTitle && (
                    <div className={`${styles.reportItem}`}>
                      {thirdColumnSymbol === "$" ? (
                        <>
                          {thirdColumnSymbol}
                          {item[Object.keys(item)[2]]
                            ?formatRoundUp(item[Object.keys(item)[2]])
                            : 0}
                        </>
                      ) : (
                        <>
                          {formatRoundUp(item[Object.keys(item)[2]])}
                          {thirdColumnSymbol}
                        </>
                      )}
                      {onRowClick && (
                        <div className={styles.chevronRightIconContainer}>
                          <Image
                            src="/icons/chevron-right.svg"
                            height={16}
                            width={16}
                            alt="Chevron right icon"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
