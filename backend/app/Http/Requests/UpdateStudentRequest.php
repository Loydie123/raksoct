<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->route('student')->id;

        return [
            'student_number' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('students', 'student_number')->ignore($studentId),
            ],
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'grade_level' => 'sometimes|string|max:50',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('students', 'email')->ignore($studentId),
            ],
            'status' => 'sometimes|in:active,inactive',
        ];
    }
}
