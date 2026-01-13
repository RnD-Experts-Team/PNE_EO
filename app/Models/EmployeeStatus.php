<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeStatus extends Model
{
    protected $fillable = ['value'];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
