import React from "react";
import Image from "next/image";
import exclamation from "../../../../public/icons/exclamation.svg";
import styles from "./DataError.module.scss";

interface DataErrorProps {
  errorMessage: string;
}

const handleRefresh = () => {
  window.location.reload();
};

const DataError = ({ errorMessage }: DataErrorProps) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <div className={styles.exclamationSvgContainer}>
          <Image
            src={exclamation}
            alt="Exclamation Icon"
            width={18}
            height={20}
            className={styles.exclamationSvg}
          />
        </div>
        <p className={styles.message1}>{errorMessage}</p>
        <p className={styles.message2}>
          Check your connectivity and try again.
        </p>
      </div>
      <div className={styles.tryAgain}>
        <button onClick={handleRefresh}>Try again</button>
      </div>
    </div>
  );
};

export default DataError;
