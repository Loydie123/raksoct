import { Badge } from '../ui';
import { IMPORT_STATUS } from '../../constants';
import { formatDateTime } from '../../utils';
import type { ImportLog } from '../../types';

interface ImportLogsTableProps {
  logs: ImportLog[];
  loading: boolean;
  onViewDetails: (log: ImportLog) => void;
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' => {
  switch (status) {
    case IMPORT_STATUS.COMPLETED:
      return 'success';
    case IMPORT_STATUS.FAILED:
      return 'danger';
    default:
      return 'warning';
  }
};

export default function ImportLogsTable({ logs, loading, onViewDetails }: ImportLogsTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return <div className="p-8 text-center text-gray-500">No import logs yet</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filename
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Summary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {log.filename}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.user?.name || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(log.status)}>{log.status}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.status === IMPORT_STATUS.PROCESSING ? (
                  <span className="text-yellow-600">Processing...</span>
                ) : (
                  <>
                    <span className="text-green-600">
                      {log.summary_json.successful_requests} created
                    </span>
                    {log.summary_json.skipped_rows > 0 && (
                      <span className="text-red-600 ml-2">
                        {log.summary_json.skipped_rows} skipped
                      </span>
                    )}
                  </>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(log.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(log)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
