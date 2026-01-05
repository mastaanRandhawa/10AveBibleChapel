import { parseAPIError } from "./apiErrorHandler";

// API base URL - adjust for production
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to build headers
const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic fetch wrapper with enhanced error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "An error occurred",
    }));
    
    // Parse and throw enhanced error
    const error = parseAPIError(response, errorData);
    throw error;
  }

  return response.json();
}

// ============================================================================
// AUTH API
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return fetchAPI<AuthResponse>("/auth/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return fetchAPI<AuthResponse>("/auth/register", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser() {
    return fetchAPI("/auth/me", {
      method: "GET",
      headers: getHeaders(true),
    });
  },
};

// ============================================================================
// ANNOUNCEMENTS API
// ============================================================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  priority?: string;
  status: string;
  isPublic: boolean;
  publishedAt?: string;
  pinned: boolean;
  startDate?: string;
  endDate?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const announcementsAPI = {
  async getAll(params?: Record<string, string>): Promise<Announcement[]> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return fetchAPI<Announcement[]>(`/announcements${queryString}`);
  },

  async getById(id: string): Promise<Announcement> {
    return fetchAPI<Announcement>(`/announcements/${id}`);
  },

  async create(data: Partial<Announcement>): Promise<Announcement> {
    return fetchAPI<Announcement>("/announcements", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Announcement>): Promise<Announcement> {
    return fetchAPI<Announcement>(`/announcements/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/announcements/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ============================================================================
// CALENDAR EVENTS API
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  recurrence?: string;
  location?: string;
  category?: string;
  color?: string;
  status: string;
  isPublic: boolean;
  link?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const calendarAPI = {
  async getAll(params?: Record<string, string>): Promise<CalendarEvent[]> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return fetchAPI<CalendarEvent[]>(`/calendar${queryString}`);
  },

  async getById(id: string): Promise<CalendarEvent> {
    return fetchAPI<CalendarEvent>(`/calendar/${id}`);
  },

  async create(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return fetchAPI<CalendarEvent>("/calendar", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<CalendarEvent>
  ): Promise<CalendarEvent> {
    return fetchAPI<CalendarEvent>(`/calendar/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/calendar/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ============================================================================
// SERMONS API
// ============================================================================

export interface Sermon {
  id: string;
  title: string;
  description?: string;
  speaker: string;
  date: string;
  passage?: string;
  series?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  status: string;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sermonsAPI = {
  async getAll(params?: Record<string, string>): Promise<Sermon[]> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return fetchAPI<Sermon[]>(`/sermons${queryString}`);
  },

  async getById(id: string): Promise<Sermon> {
    return fetchAPI<Sermon>(`/sermons/${id}`);
  },

  async getBySeries(seriesName: string): Promise<Sermon[]> {
    return fetchAPI<Sermon[]>(`/sermons/series/${seriesName}`);
  },

  async create(data: Partial<Sermon>): Promise<Sermon> {
    return fetchAPI<Sermon>("/sermons", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Sermon>): Promise<Sermon> {
    return fetchAPI<Sermon>(`/sermons/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/sermons/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ============================================================================
// PRAYER REQUESTS API
// ============================================================================

export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  requester?: string;
  isPrivate: boolean;
  isAnswered: boolean;
  answeredAt?: string;
  answerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const prayerRequestsAPI = {
  async getAll(params?: Record<string, string>): Promise<PrayerRequest[]> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return fetchAPI<PrayerRequest[]>(`/prayer-requests${queryString}`, {
      headers: getHeaders(true),
    });
  },

  async getById(id: string): Promise<PrayerRequest> {
    return fetchAPI<PrayerRequest>(`/prayer-requests/${id}`, {
      headers: getHeaders(true),
    });
  },

  async create(data: Partial<PrayerRequest>): Promise<PrayerRequest> {
    return fetchAPI<PrayerRequest>("/prayer-requests", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<PrayerRequest>
  ): Promise<PrayerRequest> {
    return fetchAPI<PrayerRequest>(`/prayer-requests/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/prayer-requests/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ============================================================================
// USERS API
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersAPI = {
  async getAll(params?: Record<string, string>): Promise<User[]> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return fetchAPI<User[]>(`/users${queryString}`, {
      headers: getHeaders(true),
    });
  },

  async getById(id: string): Promise<User> {
    return fetchAPI<User>(`/users/${id}`, {
      headers: getHeaders(true),
    });
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return fetchAPI<User>(`/users/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateApproval(id: string, isApproved: boolean): Promise<User> {
    return fetchAPI<User>(`/users/${id}/approval`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify({ isApproved }),
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};
