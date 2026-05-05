import { useState } from 'react';
import { Button, Modal } from '../ui';
import type { ServiceRequest } from '../../types';

interface ActionModalProps {
  isOpen: boolean;
  request: ServiceRequest | null;
  actionType: 'approve' | 'reject';
  onClose: () => void;
  onConfirm: (remarks: string) => Promise<void>;
}

export default function ActionModal({ isOpen, request, actionType, onClose, onConfirm }: ActionModalProps) {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(remarks);
      setRemarks('');
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Request #${request.id}`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks {actionType === 'reject' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required={actionType === 'reject'}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={actionType === 'reject' ? 'Please provide a reason for rejection' : 'Optional remarks'}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'approve' ? 'success' : 'danger'}
            onClick={handleConfirm}
            isLoading={loading}
            disabled={actionType === 'reject' && !remarks}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
