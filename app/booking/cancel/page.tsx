import styles from "../success/page.module.css";

export default function BookingCancelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title}>Booking cancelled</h1>
        <p className={styles.message}>
          Your payment was not completed. The slot may still be available.
        </p>
        <a href="/slots" className={styles.link}>
          Back to available slots
        </a>
      </div>
    </div>
  );
}