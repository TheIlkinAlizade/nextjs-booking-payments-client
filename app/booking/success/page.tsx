"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { PaymentStatus } from "@/types";
import styles from "./page.module.css";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { token } = useAuth();

  const [status, setStatus] = useState<PaymentStatus | "LOADING">("LOADING");

  useEffect(() => {
    if (!bookingId || !token) return;

    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const result = await api.getPaymentStatus(bookingId, token);
        if (result.paymentStatus === "SUCCEEDED") {
          setStatus("SUCCEEDED");
          clearInterval(interval);
        } else if (attempts >= 10) {
          setStatus(result.paymentStatus);
          clearInterval(interval);
        }
      } catch {
        if (attempts >= 10) clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [bookingId, token]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          {status === "SUCCEEDED" ? "✅" : "⏳"}
        </div>
        <h1 className={styles.title}>
          {status === "SUCCEEDED"
            ? "Booking confirmed!"
            : "Confirming your payment..."}
        </h1>
        <p className={styles.message}>
          {status === "SUCCEEDED"
            ? "Your slot is booked and payment was successful."
            : "This usually takes just a few seconds."}
        </p>
        <a href="/bookings" className={styles.link}>
          View my bookings
        </a>
      </div>
    </div>
  );
}