<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = ['manual_id', 'name'];

    public function expenses(): HasMany
    {
        return $this->hasMany(StoreExpense::class);
    }
}
