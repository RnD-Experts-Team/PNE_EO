<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = ['tag_name'];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_tag')->withTimestamps();
    }
}
