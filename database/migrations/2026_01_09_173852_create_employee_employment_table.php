<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_employment', function (Blueprint $table) {
            $table->foreignId('employee_id')->primary()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('department', 150);
            $table->string('location', 150);
            $table->string('designation', 150);
            $table->date('hiring_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_employment');
    }
};
