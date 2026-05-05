<?php

namespace App\Http\Requests;

use App\Models\ServiceRequest;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:students,id',
            'service_type' => 'required|in:ID Replacement,Good Moral Certificate,Form 137',
            'date_requested' => 'required|date',
            'remarks' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'service_type.in' => 'Invalid service type. Must be: ID Replacement, Good Moral Certificate, or Form 137',
        ];
    }
}
