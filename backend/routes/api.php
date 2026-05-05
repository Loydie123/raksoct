<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\ServiceRequestController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Students
    Route::apiResource('students', StudentController::class);

    // Service Requests
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::post('/service-requests/{serviceRequest}/approve', [ServiceRequestController::class, 'approve']);
    Route::post('/service-requests/{serviceRequest}/reject', [ServiceRequestController::class, 'reject']);

    // Import
    Route::post('/import/upload', [ImportController::class, 'upload']);
    Route::get('/import/logs', [ImportController::class, 'index']);
    Route::get('/import/logs/{importLog}', [ImportController::class, 'show']);
});
