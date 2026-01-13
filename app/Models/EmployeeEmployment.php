<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEmployment extends Model
{
    protected $table = 'employee_employment';
    protected $primaryKey = 'employee_id';
    public $incrementing = false;

    protected $fillable = [
        'employee_id',
        'department',
        'location',
        'designation',
        'hiring_date',
    ];

    protected $casts = [
        'hiring_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
