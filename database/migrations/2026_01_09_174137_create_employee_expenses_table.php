<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('expense_type_id')->constrained('expense_types')->cascadeOnUpdate()->restrictOnDelete();
            $table->longText('expense_info')->nullable();
            $table->decimal('value', 12, 2)->default(0);
            $table->longText('notes')->nullable();
            $table->date('expense_date');
            $table->timestamps();

            $table->index(['employee_id', 'expense_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_expenses');
    }
};
