import { Badge } from '../ui';
import { SERVICE_REQUEST_STATUS } from '../../constants';
import { formatDate, getFullName } from '../../utils';
import type { ServiceRequest } from '../../types';

interface ServiceRequestTableProps {
  requests: ServiceRequest[];
  loading: boolean;
  isAdmin: boolean;
  onApprove: (request: ServiceRequest) => void;
  onReject: (request: ServiceRequest) => void;
  onDelete: (id: number) => void;
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' => {
  switch (status) {
    case SERVICE_REQUEST_STATUS.APPROVED:
      return 'success';
    case SERVICE_REQUEST_STATUS.REJECTED:
      return 'danger';
    default:
      return 'warning';
  }
};

export default function ServiceRequestTable({
  requests,
  loading,
  isAdmin,
  onApprove,
  onReject,
  onDelete,
}: ServiceRequestTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No service requests found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Requested
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remarks
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{request.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.student
                  ? getFullName(request.student.first_name, request.student.last_name)
                  : 'N/A'}
                <br />
                <span className="text-xs text-gray-400">
                  {request.student?.student_number}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.service_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(request.date_requested)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {request.remarks || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {request.status === SERVICE_REQUEST_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => onApprove(request)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(request)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Reject
                    </button>
                  </>
                )}
                {isAdmin && (
                  <button
                    onClick={() => onDelete(request.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
