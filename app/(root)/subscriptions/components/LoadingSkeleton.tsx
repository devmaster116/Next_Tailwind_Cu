import styles from './LoadingSkeleton.module.scss'; // Import CSS module

const LoadingSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.subscriptionStatus}>
        <div className={styles.icon} />
        <div className={styles.text} />
      </div>
      <div className={styles.title} />
      <div className={styles.details}>
        <div className={styles.addOns} />
        <div className={styles.price} />
      <div className={styles.footer} />
      </div>
    </div>
  );
};

export default LoadingSkeleton;