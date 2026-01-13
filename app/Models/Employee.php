<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'preferred_name',
        'employee_status_id',
        'about_me',
    ];

    public function status(): BelongsTo
    {
        return $this->belongsTo(EmployeeStatus::class, 'employee_status_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class);
    }

    public function employment(): HasOne
    {
        return $this->hasOne(EmployeeEmployment::class);
    }

    public function demographics(): HasOne
    {
        return $this->hasOne(EmployeeDemographics::class);
    }

    public function identifiers(): HasOne
    {
        return $this->hasOne(EmployeeIdentifiers::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(EmployeeAddress::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'employee_tag')->withTimestamps();
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(EmployeeExpense::class);
    }
}
