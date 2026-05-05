<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'service_type',
        'date_requested',
        'status',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'date_requested' => 'date',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public static function getServiceTypes(): array
    {
        return [
            'ID Replacement',
            'Good Moral Certificate',
            'Form 137',
        ];
    }

    public static function normalizeServiceType(string $input): ?string
    {
        $input = strtolower(trim($input));
        
        $mappings = [
            'id replacement' => 'ID Replacement',
            'id' => 'ID Replacement',
            'id repl' => 'ID Replacement',
            'id replace' => 'ID Replacement',
            'idreplacement' => 'ID Replacement',
            
            'good moral certificate' => 'Good Moral Certificate',
            'goodmoral' => 'Good Moral Certificate',
            'good moral' => 'Good Moral Certificate',
            'good moral cert' => 'Good Moral Certificate',
            'goodmoralcertificate' => 'Good Moral Certificate',
            
            'form 137' => 'Form 137',
            'form137' => 'Form 137',
            'f137' => 'Form 137',
        ];

        return $mappings[$input] ?? null;
    }
}
