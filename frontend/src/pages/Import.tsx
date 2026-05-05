import { useState } from 'react';
import { FileUpload, ImportLogsTable, ImportDetailsModal } from '../components/import';
import { useImportLogs, useUploadImport } from '../hooks';
import type { ImportLog } from '../types';

export default function Import() {
  const [selectedLog, setSelectedLog] = useState<ImportLog | null>(null);
  const { logs, loading } = useImportLogs();
  const { upload, uploading, error, success } = useUploadImport();

  const handleUpload = async (file: File) => {
    try {
      await upload(file);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Import Service Requests</h1>

      <FileUpload
        onUpload={handleUpload}
        uploading={uploading}
        error={error}
        success={success}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Import History</h2>
        </div>

        <ImportLogsTable logs={logs} loading={loading} onViewDetails={setSelectedLog} />
      </div>

      <ImportDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
