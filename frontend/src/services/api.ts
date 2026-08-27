import {
  ClubSummary,
  ClubDetail,
  StudentIn,
  RegistrationResponse,
  LoginResponse,
  AdminStats,
  StudentOut,
  RegistrationOut,
  StaffProfile,
  SystemSetting,
  AuditLog,
  SystemHealth,
} from '../types';
import { authService } from './auth';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...authService.getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

let clubsCache: { key: string; data: ClubSummary[]; timestamp: number } | null = null;
const clubDetailCache: Record<string, { data: ClubDetail; timestamp: number }> = {};
const CACHE_TTL_MS = 60000; // 60s cache TTL for public directory

export const api = {
  // Public with high-performance in-memory cache
  getClubs: async (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    if (clubsCache && clubsCache.key === query && Date.now() - clubsCache.timestamp < CACHE_TTL_MS) {
      return clubsCache.data;
    }

    const data = await request<ClubSummary[]>(`/api/clubs${query}`);
    clubsCache = { key: query, data, timestamp: Date.now() };
    return data;
  },

  getCategories: () => request<string[]>('/api/clubs/categories'),

  getClubBySlug: async (slug: string) => {
    const cached = clubDetailCache[slug];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    const data = await request<ClubDetail>(`/api/clubs/${slug}`);
    clubDetailCache[slug] = { data, timestamp: Date.now() };
    return data;
  },

  submitRegistration: (payload: { student: StudentIn; clubs: string[] }) =>
    request<RegistrationResponse>('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auth
  login: (username_or_email: string, password: string) =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username_or_email, password }),
    }),

  // Admin Operational Dashboard
  getStats: () => request<AdminStats>('/api/admin/stats'),

  getHealth: () => request<SystemHealth>('/api/admin/health'),

  getAdminClubs: () => request<ClubDetail[]>('/api/admin/clubs'),

  createClub: (data: Partial<ClubDetail>) =>
    request<ClubDetail>('/api/admin/clubs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateClub: (slug: string, data: Partial<ClubDetail>) =>
    request<ClubDetail>(`/api/admin/clubs/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deactivateClub: (slug: string) =>
    request<{ status: string; message: string }>(`/api/admin/clubs/${slug}`, {
      method: 'DELETE',
    }),

  uploadLogo: async (slug: string, file: File): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/admin/clubs/${slug}/logo`, {
      method: 'POST',
      headers: authService.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Logo upload failed.');
    }
    return response.json();
  },

  uploadBanner: async (slug: string, file: File): Promise<{ banner_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/admin/clubs/${slug}/banner`, {
      method: 'POST',
      headers: authService.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Banner upload failed.');
    }
    return response.json();
  },

  getStudents: (search?: string, branch?: string, limit = 50, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.set('search', search);
    if (branch && branch !== 'All') params.set('branch', branch);
    return request<StudentOut[]>(`/api/admin/students?${params.toString()}`);
  },

  getStudentDetail: (id: number) => request<any>(`/api/admin/students/${id}`),

  getRegistrations: (club?: string, branch?: string, search?: string, limit = 100, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (club && club !== 'All') params.set('club', club);
    if (branch && branch !== 'All') params.set('branch', branch);
    if (search) params.set('search', search);
    return request<RegistrationOut[]>(`/api/admin/registrations?${params.toString()}`);
  },

  getStaff: () => request<StaffProfile[]>('/api/admin/staff'),

  createStaff: (data: Partial<StaffProfile>) =>
    request<StaffProfile>('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStaff: (id: number, data: Partial<StaffProfile>) =>
    request<StaffProfile>(`/api/admin/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSettings: () => request<SystemSetting[]>('/api/admin/settings'),

  updateSetting: (key: string, value: string) =>
    request<SystemSetting>(`/api/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  getAuditLogs: (search?: string, limit = 100, offset = 0) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.set('search', search);
    return request<AuditLog[]>(`/api/admin/audit-logs?${params.toString()}`);
  },

  exportExcel: async (clubSlug?: string) => {
    const query = clubSlug ? `?club=${encodeURIComponent(clubSlug)}` : '';
    const response = await fetch(`${API_BASE}/api/admin/export/excel${query}`, {
      headers: authService.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to generate Excel export.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `club-registrations-${clubSlug || 'all'}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Club Head
  getClubHeadDashboard: () => request<any>('/api/club-head/dashboard'),
};
