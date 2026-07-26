import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SlotResponse,
  CreateSlotRequest,
  BookingResponse,
  CreateBookingRequest,
  PaymentResponse,
  ErrorResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(response: ErrorResponse) {
    super(response.message);
    this.status = response.status;
    this.details = response.details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody: ErrorResponse = await response.json();
    throw new ApiError(errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  register: (data: RegisterRequest) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAvailableSlots: () => request<SlotResponse[]>("/api/slots"),

  getSlotById: (id: string) => request<SlotResponse>(`/api/slots/${id}`),

  createSlot: (data: CreateSlotRequest, token: string) =>
    request<SlotResponse>(
      "/api/slots",
      { method: "POST", body: JSON.stringify(data) },
      token
    ),

  cancelSlot: (id: string, token: string) =>
    request<void>(`/api/slots/${id}`, { method: "DELETE" }, token),

  createBooking: (data: CreateBookingRequest, token: string) =>
    request<BookingResponse>(
      "/api/bookings",
      { method: "POST", body: JSON.stringify(data) },
      token
    ),

  getMyBookings: (token: string) =>
    request<BookingResponse[]>("/api/bookings/me", {}, token),

  getBookingById: (id: string, token: string) =>
    request<BookingResponse>(`/api/bookings/${id}`, {}, token),

  getPaymentStatus: (bookingId: string, token: string) =>
    request<PaymentResponse>(`/api/payments/${bookingId}`, {}, token),
};

export { ApiError };