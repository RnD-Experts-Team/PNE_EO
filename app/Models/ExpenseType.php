<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpenseType extends Model
{
    use SoftDeletes;

    protected $fillable = ['type_name', 'description'];

    public function employeeExpenses(): HasMany
    {
        return $this->hasMany(EmployeeExpense::class);
    }

    public function storeExpenses(): HasMany
    {
        return $this->hasMany(StoreExpense::class);
    }
}
