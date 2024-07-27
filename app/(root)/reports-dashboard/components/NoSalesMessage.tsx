import React from "react";
import styles from "./NoSalesMessage.module.scss";
import Image from "next/image";
import fileQuestionSvg from "../../../../public/icons/file-question-02.svg";

interface NoSalesMessageProps {
  message: string;
  messageDescription?: string;
}

const NoSalesMessage = ({
  message,
  messageDescription = "",
}: NoSalesMessageProps) => {
  return (
    <div className={styles.noSalesContainer}>
      <div className={styles.noSalesMessage}>
        <div className={styles.svgContainer}>
          <Image
            src={fileQuestionSvg}
            alt="File question Icon"
            width={18}
            height={20}
            className={styles.svg}
          />
        </div>
        <p className={styles.message1}>{message}</p>
        <p className={styles.message2}>{messageDescription}</p>
      </div>
    </div>
  );
};

export default NoSalesMessage;
