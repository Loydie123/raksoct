/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate student number format (STU-YYYY-XXX)
 */
export function isValidStudentNumber(studentNumber: string): boolean {
  const pattern = /^STU-\d{4}-\d{3}$/;
  return pattern.test(studentNumber);
}

/**
 * Check if string is not empty
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validate file extension
 */
export function isValidFileExtension(filename: string, allowedExtensions: readonly string[]): boolean {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Validate file size
 */
export function isValidFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value === null || value === undefined || value === '') {
      errors[field] = `${String(field)} is required`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
