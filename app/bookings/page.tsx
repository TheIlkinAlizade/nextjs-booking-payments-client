"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { BookingResponse } from "@/types";
import styles from "./page.module.css";

const statusClassMap: Record<string, string> = {
  PENDING: "statusPending",
  CONFIRMED: "statusConfirmed",
  CANCELLED: "statusCancelled",
  EXPIRED: "statusExpired",
};

export default function MyBookingsPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getMyBookings(token)
      .then(setBookings)
      .catch(() => setError("Could not load your bookings."))
      .finally(() => setIsLoading(false));
  }, [token, authLoading]);

  if (authLoading || isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (!token) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>
          Please <a href="/login">log in</a> to see your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>My Bookings</h1>

      {error && <p className={styles.empty}>{error}</p>}

      {bookings.length === 0 && (
        <p className={styles.empty}>You haven&apos;t booked anything yet.</p>
      )}

      <div className={styles.list}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.card}>
            <div>
              <h2 className={styles.slotTitle}>{booking.slotTitle}</h2>
              <p className={styles.createdAt}>
                Booked on {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`${styles.status} ${styles[statusClassMap[booking.status]]}`}
            >
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}