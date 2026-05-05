export const SERVICE_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ServiceRequestStatus = (typeof SERVICE_REQUEST_STATUS)[keyof typeof SERVICE_REQUEST_STATUS];

export const SERVICE_REQUEST_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: SERVICE_REQUEST_STATUS.PENDING, label: 'Pending' },
  { value: SERVICE_REQUEST_STATUS.APPROVED, label: 'Approved' },
  { value: SERVICE_REQUEST_STATUS.REJECTED, label: 'Rejected' },
] as const;

export const SERVICE_TYPES = {
  ID_REPLACEMENT: 'ID Replacement',
  GOOD_MORAL: 'Good Moral Certificate',
  FORM_137: 'Form 137',
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

export const SERVICE_TYPE_OPTIONS = [
  { value: SERVICE_TYPES.ID_REPLACEMENT, label: 'ID Replacement' },
  { value: SERVICE_TYPES.GOOD_MORAL, label: 'Good Moral Certificate' },
  { value: SERVICE_TYPES.FORM_137, label: 'Form 137' },
] as const;

export const STATUS_BADGE_VARIANTS: Record<ServiceRequestStatus, 'warning' | 'success' | 'error'> = {
  [SERVICE_REQUEST_STATUS.PENDING]: 'warning',
  [SERVICE_REQUEST_STATUS.APPROVED]: 'success',
  [SERVICE_REQUEST_STATUS.REJECTED]: 'error',
};
