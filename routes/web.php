<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeExpenseController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreExpenseController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('employees', EmployeeController::class);

    Route::resource('expense-types', ExpenseTypeController::class)->except(['show']);
    Route::patch('expense-types/{expenseType}/restore', [ExpenseTypeController::class, 'restore'])
        ->name('expense-types.restore');

    Route::resource('stores', StoreController::class);

    Route::prefix('employees/{employee}')->group(function () {
        Route::get('expenses/create', [EmployeeExpenseController::class, 'create'])->name('employees.expenses.create');
        Route::post('expenses', [EmployeeExpenseController::class, 'store'])->name('employees.expenses.store');
        Route::get('expenses/{expense}', [EmployeeExpenseController::class, 'show'])->name('employees.expenses.show');
    });

    Route::prefix('stores/{store}')->group(function () {
        Route::get('expenses/create', [StoreExpenseController::class, 'create'])->name('stores.expenses.create');
        Route::post('expenses', [StoreExpenseController::class, 'store'])->name('stores.expenses.store');
        Route::get('expenses/{expense}', [StoreExpenseController::class, 'show'])->name('stores.expenses.show');
    });

    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/settings.php';
