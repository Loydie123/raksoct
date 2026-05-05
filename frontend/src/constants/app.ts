export const APP_CONFIG = {
  APP_NAME: 'Student Services Management',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  DEFAULT_PAGE_SIZE: 15,
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  STUDENTS: '/students',
  SERVICE_REQUESTS: '/service-requests',
  IMPORT: '/import',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const QUERY_KEYS = {
  STUDENTS: 'students',
  SERVICE_REQUESTS: 'serviceRequests',
  IMPORT_LOGS: 'importLogs',
  USER: 'user',
} as const;
