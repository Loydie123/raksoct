export const IMPORT_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type ImportStatus = (typeof IMPORT_STATUS)[keyof typeof IMPORT_STATUS];

export const IMPORT_STATUS_BADGE_VARIANTS: Record<ImportStatus, 'warning' | 'success' | 'error'> = {
  [IMPORT_STATUS.PROCESSING]: 'warning',
  [IMPORT_STATUS.COMPLETED]: 'success',
  [IMPORT_STATUS.FAILED]: 'error',
};

export const ALLOWED_IMPORT_FILE_TYPES = ['.csv', '.xlsx', '.xls'] as const;

export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const IMPORT_FILE_COLUMNS = {
  STUDENT_NUMBER: 'Student Number',
  SERVICE_TYPE: 'Service Type',
  REQUESTED_DATE: 'Requested Date',
} as const;
