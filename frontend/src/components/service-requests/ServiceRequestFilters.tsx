import { useState } from 'react';
import { Button, Select, Input } from '../ui';
import { SERVICE_REQUEST_STATUS_OPTIONS } from '../../constants';

interface ServiceRequestFiltersProps {
  onFilter: (status: string, dateFrom: string, dateTo: string) => void;
}

export default function ServiceRequestFilters({ onFilter }: ServiceRequestFiltersProps) {
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleFilter = () => {
    onFilter(status, dateFrom, dateTo);
  };

  const handleReset = () => {
    setStatus('');
    setDateFrom('');
    setDateTo('');
    onFilter('', '', '');
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 border-b border-gray-200">
      <Select
        options={SERVICE_REQUEST_STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        placeholder="From Date"
      />
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        placeholder="To Date"
      />
      <Button variant="secondary" onClick={handleFilter}>
        Filter
      </Button>
      <Button variant="secondary" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
