<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDemographics extends Model
{
    protected $table = 'employee_demographics';
    protected $primaryKey = 'employee_id';
    public $incrementing = false;

    protected $fillable = [
        'employee_id',
        'date_of_birth',
        'gender',
        'marital_status',
        'veteran_status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'veteran_status' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
