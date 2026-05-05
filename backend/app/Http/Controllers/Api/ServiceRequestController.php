<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateServiceRequestRequest;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ServiceRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServiceRequest::with('student');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('date_requested', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('date_requested', '<=', $request->date_to);
        }

        if ($request->has('service_type')) {
            $query->where('service_type', $request->service_type);
        }

        $serviceRequests = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($serviceRequests);
    }

    public function store(StoreServiceRequestRequest $request): JsonResponse
    {
        $serviceRequest = ServiceRequest::create($request->validated());

        return response()->json([
            'message' => 'Service request created successfully',
            'service_request' => $serviceRequest->load('student'),
        ], 201);
    }

    public function show(ServiceRequest $serviceRequest): JsonResponse
    {
        return response()->json([
            'service_request' => $serviceRequest->load('student'),
        ]);
    }

    public function update(UpdateServiceRequestRequest $request, ServiceRequest $serviceRequest): JsonResponse
    {
        $serviceRequest->update($request->validated());

        return response()->json([
            'message' => 'Service request updated successfully',
            'service_request' => $serviceRequest->fresh()->load('student'),
        ]);
    }

    public function destroy(ServiceRequest $serviceRequest): JsonResponse
    {
        Gate::authorize('delete', $serviceRequest);

        $serviceRequest->delete();

        return response()->json([
            'message' => 'Service request deleted successfully',
        ]);
    }

    public function approve(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        if (!$serviceRequest->isPending()) {
            return response()->json([
                'message' => 'Only pending requests can be approved',
            ], 422);
        }

        $serviceRequest->update([
            'status' => 'approved',
            'remarks' => $request->remarks ?? $serviceRequest->remarks,
        ]);

        return response()->json([
            'message' => 'Service request approved successfully',
            'service_request' => $serviceRequest->fresh()->load('student'),
        ]);
    }

    public function reject(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        if (!$serviceRequest->isPending()) {
            return response()->json([
                'message' => 'Only pending requests can be rejected',
            ], 422);
        }

        $request->validate([
            'remarks' => 'required|string|max:500',
        ]);

        $serviceRequest->update([
            'status' => 'rejected',
            'remarks' => $request->remarks,
        ]);

        return response()->json([
            'message' => 'Service request rejected successfully',
            'service_request' => $serviceRequest->fresh()->load('student'),
        ]);
    }
}
