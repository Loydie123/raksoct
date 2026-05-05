<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\ServiceRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Staff user
        User::create([
            'name' => 'Staff User',
            'email' => 'staff@school.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);

        // Create sample students
        $students = [
            [
                'student_number' => 'STU-2024-001',
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'grade_level' => 'Grade 10',
                'email' => 'juan.delacruz@student.school.com',
                'status' => 'active',
            ],
            [
                'student_number' => 'STU-2024-002',
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'grade_level' => 'Grade 11',
                'email' => 'maria.santos@student.school.com',
                'status' => 'active',
            ],
            [
                'student_number' => 'STU-2024-003',
                'first_name' => 'Pedro',
                'last_name' => 'Reyes',
                'grade_level' => 'Grade 12',
                'email' => 'pedro.reyes@student.school.com',
                'status' => 'active',
            ],
            [
                'student_number' => 'STU-2024-004',
                'first_name' => 'Ana',
                'last_name' => 'Garcia',
                'grade_level' => 'Grade 9',
                'email' => 'ana.garcia@student.school.com',
                'status' => 'inactive',
            ],
        ];

        foreach ($students as $studentData) {
            Student::create($studentData);
        }

        // Create sample service requests
        ServiceRequest::create([
            'student_id' => 1,
            'service_type' => 'ID Replacement',
            'date_requested' => now()->subDays(5),
            'status' => 'pending',
        ]);

        ServiceRequest::create([
            'student_id' => 2,
            'service_type' => 'Good Moral Certificate',
            'date_requested' => now()->subDays(3),
            'status' => 'approved',
            'remarks' => 'Approved for scholarship application',
        ]);

        ServiceRequest::create([
            'student_id' => 3,
            'service_type' => 'Form 137',
            'date_requested' => now()->subDay(),
            'status' => 'pending',
        ]);
    }
}
