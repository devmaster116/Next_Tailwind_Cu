import styles from "./LoadingSkeleton.module.scss";

const LoadingSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title} />
      <div className={styles.details}>
        <div className={styles.addOns} />
      </div>

      <div className={styles.border} />

      <div className={styles.title} />
      <div className={styles.details}>
        <div className={styles.addOns} />
      </div>

      <div className={styles.border} />

      <div className={styles.title} />
      <div className={styles.details}>
        <div className={styles.addOns} />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
