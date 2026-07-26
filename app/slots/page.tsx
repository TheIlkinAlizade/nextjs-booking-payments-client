"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { SlotResponse } from "@/types";
import styles from "./page.module.css";

export default function SlotsPage() {
  const { user, token } = useAuth();

  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAvailableSlots()
      .then(setSlots)
      .catch(() => setError("Could not load slots."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleBook(slotId: string) {
    if (!token) return;

    setError(null);
    setBookingSlotId(slotId);

    try {
      const booking = await api.createBooking({ slotId }, token);
      if (booking.checkoutUrl) {
        window.location.href = booking.checkoutUrl;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not start booking. Please try again.");
      }
      setBookingSlotId(null);
    }
  }

  if (isLoading) {
    return <p className={styles.loading}>Loading slots...</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Available Consultation Sessions</h1>

      {error && <p className={styles.error}>{error}</p>}

      {slots.length === 0 && <p className={styles.empty}>No slots available right now.</p>}

      <div className={styles.list}>
        {slots.map((slot) => (
          <div key={slot.id} className={styles.card}>
            <div>
              <h2 className={styles.slotTitle}>{slot.title}</h2>
              <p className={styles.slotTime}>
                {new Date(slot.startTime).toLocaleString()} &rarr;{" "}
                {new Date(slot.endTime).toLocaleString()}
              </p>
              <p className={styles.slotPrice}>
                {slot.price} {slot.currency}
              </p>
            </div>

            {user ? (
              <button
                onClick={() => handleBook(slot.id)}
                disabled={bookingSlotId === slot.id}
                className={styles.button}
              >
                {bookingSlotId === slot.id ? "Redirecting..." : "Book"}
              </button>
            ) : (
              <a href="/login" className={styles.link}>
                Log in to book
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}