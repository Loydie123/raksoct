<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('service_type', ['ID Replacement', 'Good Moral Certificate', 'Form 137']);
            $table->date('date_requested');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'service_type', 'date_requested'], 'unique_student_service_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
