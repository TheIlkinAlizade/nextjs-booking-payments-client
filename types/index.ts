export type Role = "USER" | "ADMIN";

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type SlotStatus = "AVAILABLE" | "BOOKED" | "CANCELLED";

export interface SlotResponse {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  status: SlotStatus;
}

export interface CreateSlotRequest {
  title: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface BookingResponse {
  id: string;
  slotId: string;
  slotTitle: string;
  status: BookingStatus;
  createdAt: string;
  checkoutUrl?: string;
}

export interface CreateBookingRequest {
  slotId: string;
}

export type PaymentStatus = "CREATED" | "SUCCEEDED" | "FAILED" | "EXPIRED";

export interface PaymentResponse {
  bookingId: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details?: string[];
}