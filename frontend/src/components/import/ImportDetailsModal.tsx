import { Button, Modal } from '../ui';
import type { ImportLog } from '../../types';

interface ImportDetailsModalProps {
  log: ImportLog | null;
  onClose: () => void;
}

export default function ImportDetailsModal({ log, onClose }: ImportDetailsModalProps) {
  if (!log) return null;

  return (
    <Modal isOpen={!!log} onClose={onClose} title={`Import Details: ${log.filename}`}>
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard label="Total Rows" value={log.summary_json.total_rows} bgColor="bg-gray-50" />
          <StatCard
            label="Successful"
            value={log.summary_json.successful_requests}
            bgColor="bg-green-50"
            textColor="text-green-700"
          />
          <StatCard
            label="New Students"
            value={log.summary_json.new_students_created}
            bgColor="bg-blue-50"
            textColor="text-blue-700"
          />
          <StatCard
            label="Skipped"
            value={log.summary_json.skipped_rows}
            bgColor="bg-red-50"
            textColor="text-red-700"
          />
        </div>

        {log.summary_json.errors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Errors:</h4>
            <div className="bg-red-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {log.summary_json.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-700 mb-1">
                  <span className="font-medium">Row {error.row}:</span> {error.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}

function StatCard({
  label,
  value,
  bgColor,
  textColor = 'text-gray-900',
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor?: string;
}) {
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
    </div>
  );
}
