<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_identifiers', function (Blueprint $table) {
            $table->foreignId('employee_id')->primary()->constrained()->cascadeOnUpdate()->cascadeOnDelete();

            $table->string('social_security_number', 25)->nullable();
            $table->string('national_id_number', 50)->nullable();
            $table->string('itin', 50)->nullable();

            $table->timestamps();

            $table->unique('social_security_number');
            $table->unique('national_id_number');
            $table->unique('itin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_identifiers');
    }
};
