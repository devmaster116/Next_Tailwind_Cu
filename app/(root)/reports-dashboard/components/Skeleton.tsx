import React from "react";
import styles from "./Skeleton.module.scss";

const Skeleton = () => {
  const skeletonItems = new Array(5).fill(null);

  return (
    <div className={styles.card}>
      <div className={styles.cardImageSkeleton}></div>
      <div>
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className={`${styles.cardIntro} ${styles.skeleton}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
