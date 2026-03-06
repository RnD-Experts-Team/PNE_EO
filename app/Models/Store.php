<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
       public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
        'id',
        'manual_id',
        'name',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'country',
        'postal_code',
    ];

    public function expenses(): HasMany
    {
        return $this->hasMany(StoreExpense::class);
    }
}
