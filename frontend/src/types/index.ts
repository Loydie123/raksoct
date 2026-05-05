export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Student {
  id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  grade_level: string;
  email: string;
  status: 'active' | 'inactive';
  is_imported: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: number;
  student_id: number;
  service_type: 'ID Replacement' | 'Good Moral Certificate' | 'Form 137';
  date_requested: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

export interface ImportLog {
  id: number;
  filename: string;
  user_id: number;
  summary_json: {
    total_rows: number;
    successful_requests: number;
    new_students_created: number;
    skipped_rows: number;
    errors: Array<{ row: number; reason: string }>;
  };
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
