import { useState } from 'react';
import { Button, Input, Select, Alert } from '../ui';
import { STUDENT_STATUS, GRADE_LEVELS } from '../../constants';
import { getApiErrorMessage } from '../../utils';
import type { Student } from '../../types';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
}

export interface StudentFormData {
  student_number: string;
  first_name: string;
  last_name: string;
  grade_level: string;
  email: string;
  status: 'active' | 'inactive';
}

const statusOptions = [
  { value: STUDENT_STATUS.ACTIVE, label: 'Active' },
  { value: STUDENT_STATUS.INACTIVE, label: 'Inactive' },
];

const gradeLevelOptions = GRADE_LEVELS.map((level) => ({
  value: level,
  label: level,
}));

export default function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    student_number: initialData?.student_number || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    grade_level: initialData?.grade_level || '',
    email: initialData?.email || '',
    status: initialData?.status || STUDENT_STATUS.ACTIVE,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      const errors = apiError.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof StudentFormData, value: string) => {
    if (field === 'status') {
      setFormData((prev) => ({ ...prev, [field]: value as 'active' | 'inactive' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert type="error" message={error} />

      <Input
        label="Student Number"
        placeholder="STU-2024-001"
        required
        value={formData.student_number}
        onChange={(e) => handleChange('student_number', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          value={formData.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
        />
        <Input
          label="Last Name"
          required
          value={formData.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
        />
      </div>

      <Select
        label="Grade Level"
        options={[{ value: '', label: 'Select Grade Level' }, ...gradeLevelOptions]}
        value={formData.grade_level}
        onChange={(e) => handleChange('grade_level', e.target.value)}
        required
      />

      <Input
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />

      <Select
        label="Status"
        options={statusOptions}
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
