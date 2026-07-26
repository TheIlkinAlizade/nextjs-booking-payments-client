"use client";

import { useAuth } from "@/lib/auth-context";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <a href="/" className={styles.brand}>
          Consultment Booking
        </a>
        <a href="/slots" className={styles.link}>
          Browse Slots
        </a>
        {user && (
          <a href="/bookings" className={styles.link}>
            My Bookings
          </a>
        )}
        {user?.role === "ADMIN" && (
          <a href="/admin" className={styles.link}>
            Admin
          </a>
        )}
      </div>

      <div className={styles.right}>
        {user ? (
          <>
            <span className={styles.userName}>{user.fullName}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="/login" className={styles.link}>
              Log in
            </a>
            <a href="/register" className={styles.link}>
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}