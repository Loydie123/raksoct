export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export const STUDENT_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: STUDENT_STATUS.ACTIVE, label: 'Active' },
  { value: STUDENT_STATUS.INACTIVE, label: 'Inactive' },
] as const;

export const GRADE_LEVELS = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];
