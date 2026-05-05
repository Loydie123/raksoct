import { useState } from 'react';
import { Button, Select, Input, Alert } from '../ui';
import { SERVICE_TYPE_OPTIONS, SERVICE_TYPES, STUDENT_STATUS } from '../../constants';
import { toISODateString, getApiErrorMessage, getFullName } from '../../utils';
import type { Student } from '../../types';

interface ServiceRequestFormProps {
  students: Student[];
  onSubmit: (data: ServiceRequestFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ServiceRequestFormData {
  student_id: string;
  service_type: string;
  date_requested: string;
  remarks: string;
}

export default function ServiceRequestForm({ students, onSubmit, onCancel }: ServiceRequestFormProps) {
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    student_id: '',
    service_type: SERVICE_TYPES.ID_REPLACEMENT,
    date_requested: toISODateString(new Date()),
    remarks: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeStudents = students.filter((s) => s.status === STUDENT_STATUS.ACTIVE);

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...activeStudents.map((s) => ({
      value: String(s.id),
      label: `${s.student_number} - ${getFullName(s.first_name, s.last_name)}`,
    })),
  ];

  const serviceTypeOptions = SERVICE_TYPE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert type="error" message={error} />

      <Select
        label="Student"
        options={studentOptions}
        value={formData.student_id}
        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
        required
      />

      <Select
        label="Service Type"
        options={serviceTypeOptions}
        value={formData.service_type}
        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
        required
      />

      <Input
        label="Date Requested"
        type="date"
        value={formData.date_requested}
        onChange={(e) => setFormData({ ...formData, date_requested: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarks (Optional)
        </label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create
        </Button>
      </div>
    </form>
  );
}
