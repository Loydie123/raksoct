import { useState } from 'react';
import { Button, Modal, Pagination } from '../components/ui';
import {
  ServiceRequestForm,
  ServiceRequestTable,
  ServiceRequestFilters,
  ActionModal,
} from '../components/service-requests';
import { useServiceRequests, useServiceRequestMutations, useStudents } from '../hooks';
import { useAuth } from '../hooks';
import type { ServiceRequest } from '../types';
import type { ServiceRequestFormData } from '../components/service-requests/ServiceRequestForm';

export default function ServiceRequests() {
  const { isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const { requests, loading, totalPages } = useServiceRequests({
    status: statusFilter,
    dateFrom,
    dateTo,
    page: currentPage,
  });

  const { students } = useStudents({ page: 1 });
  const { createRequest, approveRequest, rejectRequest, deleteRequest } = useServiceRequestMutations();

  const handleFilter = (status: string, from: string, to: string) => {
    setStatusFilter(status);
    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
  };

  const handleSubmit = async (data: ServiceRequestFormData) => {
    await createRequest({
      student_id: parseInt(data.student_id),
      service_type: data.service_type,
      date_requested: data.date_requested,
      remarks: data.remarks || undefined,
    });
    setShowModal(false);
  };

  const handleApprove = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowActionModal(true);
  };

  const handleReject = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setShowActionModal(true);
  };

  const handleActionConfirm = async (remarks: string) => {
    if (!selectedRequest) return;

    if (actionType === 'approve') {
      await approveRequest(selectedRequest.id, remarks || undefined);
    } else {
      await rejectRequest(selectedRequest.id, remarks);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteRequest(id);
    } catch {
      alert('Only admins can delete requests');
    }
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Service Requests</h1>
        <Button onClick={() => setShowModal(true)} className="mt-3 sm:mt-0">
          New Request
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ServiceRequestFilters onFilter={handleFilter} />

        <ServiceRequestTable
          requests={requests}
          loading={loading}
          isAdmin={isAdmin}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Service Request">
        <ServiceRequestForm
          students={students}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <ActionModal
        isOpen={showActionModal}
        request={selectedRequest}
        actionType={actionType}
        onClose={() => setShowActionModal(false)}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}
