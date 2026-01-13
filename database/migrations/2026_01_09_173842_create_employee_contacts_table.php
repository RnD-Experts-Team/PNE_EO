<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('contact_type', ['work_email', 'work_phone']);
            $table->string('contact_value', 255);
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            // Optional guardrails
            $table->unique(['employee_id', 'contact_type', 'contact_value']);
            $table->index(['employee_id', 'contact_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_contacts');
    }
};
