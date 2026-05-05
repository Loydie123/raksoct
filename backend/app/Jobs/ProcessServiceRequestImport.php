<?php

namespace App\Jobs;

use App\Models\ImportLog;
use App\Models\ServiceRequest;
use App\Models\Student;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use PHPExcel_IOFactory;

class ProcessServiceRequestImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $filePath;
    protected int $importLogId;

    public function __construct(string $filePath, int $importLogId)
    {
        $this->filePath = $filePath;
        $this->importLogId = $importLogId;
    }

    public function handle(): void
    {
        $importLog = ImportLog::find($this->importLogId);
        
        if (!$importLog) {
            return;
        }

        $summary = [
            'total_rows' => 0,
            'successful_requests' => 0,
            'new_students_created' => 0,
            'skipped_rows' => 0,
            'errors' => [],
        ];

        try {
            $rows = $this->loadFile($this->filePath);

            // Skip header row
            $dataRows = array_slice($rows, 1);
            $summary['total_rows'] = count($dataRows);

            foreach ($dataRows as $index => $row) {
                $rowNumber = $index + 2; // Account for header and 0-index
                $result = $this->processRow($row, $rowNumber);

                if ($result['success']) {
                    $summary['successful_requests']++;
                    if ($result['new_student']) {
                        $summary['new_students_created']++;
                    }
                } else {
                    $summary['skipped_rows']++;
                    $summary['errors'][] = [
                        'row' => $rowNumber,
                        'reason' => $result['error'],
                    ];
                }
            }

            $importLog->update([
                'status' => 'completed',
                'summary_json' => $summary,
            ]);

        } catch (\Exception $e) {
            $summary['errors'][] = [
                'row' => 0,
                'reason' => 'File processing error: ' . $e->getMessage(),
            ];

            $importLog->update([
                'status' => 'failed',
                'summary_json' => $summary,
            ]);
        }

        // Clean up uploaded file
        if (file_exists($this->filePath)) {
            unlink($this->filePath);
        }
    }

    protected function processRow(array $row, int $rowNumber): array
    {
        $studentNumber = trim($row[0] ?? '');
        $serviceTypeRaw = trim($row[1] ?? '');
        $dateRequested = trim($row[2] ?? '');

        // Validate student number
        if (empty($studentNumber)) {
            return [
                'success' => false,
                'error' => 'Missing student number',
                'new_student' => false,
            ];
        }

        // Normalize service type
        $serviceType = ServiceRequest::normalizeServiceType($serviceTypeRaw);
        if (!$serviceType) {
            return [
                'success' => false,
                'error' => "Invalid service type: {$serviceTypeRaw}",
                'new_student' => false,
            ];
        }

        // Parse date
        try {
            $date = $this->parseDate($dateRequested);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => "Invalid date format: {$dateRequested}",
                'new_student' => false,
            ];
        }

        // Find or create student
        $student = Student::where('student_number', $studentNumber)->first();
        $newStudent = false;

        if (!$student) {
            // Auto-create student with is_imported flag
            $student = Student::create([
                'student_number' => $studentNumber,
                'first_name' => 'Imported',
                'last_name' => 'Student',
                'grade_level' => 'Unknown',
                'email' => strtolower(str_replace([' ', '-'], '', $studentNumber)) . '@imported.school.com',
                'status' => 'active',
                'is_imported' => true,
            ]);
            $newStudent = true;
        }

        // Check if student is inactive
        if (!$student->isActive()) {
            return [
                'success' => false,
                'error' => "Student {$studentNumber} is inactive",
                'new_student' => false,
            ];
        }

        // Check for duplicates
        $exists = ServiceRequest::where('student_id', $student->id)
            ->where('service_type', $serviceType)
            ->whereDate('date_requested', $date)
            ->exists();

        if ($exists) {
            return [
                'success' => false,
                'error' => "Duplicate request: {$studentNumber} - {$serviceType} - {$date}",
                'new_student' => false,
            ];
        }

        // Create service request
        ServiceRequest::create([
            'student_id' => $student->id,
            'service_type' => $serviceType,
            'date_requested' => $date,
            'status' => 'pending',
        ]);

        return [
            'success' => true,
            'error' => null,
            'new_student' => $newStudent,
        ];
    }

    protected function loadFile(string $filePath): array
    {
        if (!file_exists($filePath)) {
            throw new \Exception("File not found: {$filePath}");
        }

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if ($extension === 'csv') {
            $rows = [];
            $handle = fopen($filePath, 'r');
            if ($handle === false) {
                throw new \Exception("Cannot open file: {$filePath}");
            }
            while (($data = fgetcsv($handle)) !== false) {
                $rows[] = $data;
            }
            fclose($handle);
            return $rows;
        }

        // Excel files - note: PHPExcel is deprecated for PHP 8+
        throw new \Exception("Excel files not supported. Please use CSV format.");
    }

    protected function parseDate(string $dateString): string
    {
        // Handle Excel serial date numbers
        if (is_numeric($dateString)) {
            $unix = ($dateString - 25569) * 86400;
            return date('Y-m-d', $unix);
        }

        // Try common date formats
        $formats = ['Y-m-d', 'm/d/Y', 'd/m/Y', 'M d, Y', 'd-m-Y'];
        
        foreach ($formats as $format) {
            $date = \DateTime::createFromFormat($format, $dateString);
            if ($date) {
                return $date->format('Y-m-d');
            }
        }

        // Last resort - use strtotime
        $timestamp = strtotime($dateString);
        if ($timestamp) {
            return date('Y-m-d', $timestamp);
        }

        throw new \Exception("Cannot parse date: {$dateString}");
    }
}
