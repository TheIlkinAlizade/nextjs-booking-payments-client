"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import type { SlotResponse } from "@/types";
import styles from "./page.module.css";

export default function AdminPage() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [slots, setSlots] = useState<SlotResponse[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadSlots() {
    setIsLoadingSlots(true);
    api
      .getAvailableSlots()
      .then(setSlots)
      .finally(() => setIsLoadingSlots(false));
  }

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadSlots();
    }
  }, [user]);

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      await api.createSlot(
        {
          title,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          price: parseFloat(price),
          currency,
        },
        token
      );

      setFormSuccess("Slot created.");
      setTitle("");
      setStartTime("");
      setEndTime("");
      setPrice("");
      loadSlots();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Could not create slot.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(slotId: string) {
    if (!token) return;

    try {
      await api.cancelSlot(slotId, token);
      loadSlots();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Could not cancel slot.");
      }
    }
  }

  if (authLoading) {
    return <p className={styles.denied}>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return <p className={styles.denied}>You do not have access to this page.</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Admin — Manage Sessions</h1>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Create a new session</h2>
        <form onSubmit={handleCreateSlot} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Business Strategy Session"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Start time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Price</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                required
                className={styles.input}
              />
            </div>
          </div>

          {formError && <p className={styles.error}>{formError}</p>}
          {formSuccess && <p className={styles.success}>{formSuccess}</p>}

          <button type="submit" disabled={isSubmitting} className={styles.button}>
            {isSubmitting ? "Creating..." : "Create session"}
          </button>
        </form>
      </div>

      <h2 className={styles.listTitle}>Available sessions</h2>

      {isLoadingSlots ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.list}>
          {slots.map((slot) => (
            <div key={slot.id} className={styles.slotCard}>
              <div>
                <div className={styles.slotTitle}>{slot.title}</div>
                <div className={styles.slotMeta}>
                  {new Date(slot.startTime).toLocaleString()} — {slot.price}{" "}
                  {slot.currency}
                </div>
              </div>
              <button
                onClick={() => handleCancel(slot.id)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}