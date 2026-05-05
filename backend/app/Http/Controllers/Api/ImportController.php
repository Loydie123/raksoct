<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessServiceRequestImport;
use App\Models\ImportLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ImportController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        // Only admin can import
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Only administrators can import files',
            ], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240', // Max 10MB
        ]);

        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
        $path = $file->store('imports', 'local');
        $fullPath = storage_path('app/' . $path);

        // Create import log
        $importLog = ImportLog::create([
            'filename' => $filename,
            'user_id' => $request->user()->id,
            'summary_json' => [
                'total_rows' => 0,
                'successful_requests' => 0,
                'new_students_created' => 0,
                'skipped_rows' => 0,
                'errors' => [],
            ],
            'status' => 'processing',
        ]);

        // Dispatch job to process import
        ProcessServiceRequestImport::dispatch($fullPath, $importLog->id);

        return response()->json([
            'message' => 'File uploaded successfully. Processing started.',
            'import_log' => $importLog,
        ], 202);
    }

    public function index(Request $request): JsonResponse
    {
        $logs = ImportLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($logs);
    }

    public function show(ImportLog $importLog): JsonResponse
    {
        return response()->json([
            'import_log' => $importLog->load('user:id,name'),
        ]);
    }
}
