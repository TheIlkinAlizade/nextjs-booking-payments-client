import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Meridian Advisory</h1>
        <p className={styles.subtitle}>
          Book a one-on-one consultation with our advisors. Business
          strategy, legal guidance, and career planning — scheduled and
          paid online in minutes.
        </p>
        <a href="/slots" className={styles.cta}>
          View available sessions
        </a>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2 className={styles.featureTitle}>Pick a time</h2>
          <p className={styles.featureText}>
            Browse open consultation slots and choose what fits your
            schedule.
          </p>
        </div>
        <div className={styles.feature}>
          <h2 className={styles.featureTitle}>Pay securely</h2>
          <p className={styles.featureText}>
            Checkout is handled by Stripe. Your session is confirmed the
            moment payment clears.
          </p>
        </div>
        <div className={styles.feature}>
          <h2 className={styles.featureTitle}>Meet your advisor</h2>
          <p className={styles.featureText}>
            Show up prepared. Manage and review your bookings anytime from
            your account.
          </p>
        </div>
      </section>
    </div>
  );
}