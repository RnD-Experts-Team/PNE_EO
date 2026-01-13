<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_demographics', function (Blueprint $table) {
            $table->foreignId('employee_id')->primary()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('date_of_birth')->nullable(); // often optional in apps
            $table->enum('gender', ['Male', 'Female'])->nullable(); // consider expanding later
            $table->enum('marital_status', ['Single', 'Divorced', 'Married', 'Widowed'])->nullable();
            $table->boolean('veteran_status')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_demographics');
    }
};
