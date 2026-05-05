import { useState } from 'react';
import { Button, Input, Select } from '../ui';
import { STUDENT_STATUS_OPTIONS } from '../../constants';

interface StudentFiltersProps {
  onFilter: (search: string, status: string) => void;
}

export default function StudentFilters({ onFilter }: StudentFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(search, status);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 p-4 border-b border-gray-200">
      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px]"
      />
      <Select
        options={STUDENT_STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
