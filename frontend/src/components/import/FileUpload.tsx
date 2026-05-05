import { useState, useRef } from 'react';
import { Button, Alert } from '../ui';

interface FileUploadProps {
  onUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
  error: string;
  success: string;
}

export default function FileUpload({ onUpload, uploading, error, success }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await onUpload(selectedFile);
    if (success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Excel File</h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                Select a file to upload
              </span>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="sr-only"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">Excel or CSV files (.xlsx, .xls, .csv)</p>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-700">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <div className="mt-4">
        <Button onClick={handleUpload} disabled={!selectedFile} isLoading={uploading} className="w-full">
          Upload and Process
        </Button>
      </div>

      <ExcelFormatGuide />
    </div>
  );
}

function ExcelFormatGuide() {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Excel Format:</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1 px-2">Column A</th>
            <th className="text-left py-1 px-2">Column B</th>
            <th className="text-left py-1 px-2">Column C</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-1 px-2 font-medium">Student Number</td>
            <td className="py-1 px-2 font-medium">Service Type</td>
            <td className="py-1 px-2 font-medium">Requested Date</td>
          </tr>
          <tr>
            <td className="py-1 px-2 text-gray-500">STU-2024-001</td>
            <td className="py-1 px-2 text-gray-500">Good Moral</td>
            <td className="py-1 px-2 text-gray-500">2024-05-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
