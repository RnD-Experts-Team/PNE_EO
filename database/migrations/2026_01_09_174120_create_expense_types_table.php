<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('expense_types', function (Blueprint $table) {
            $table->id();
            $table->string('type_name', 150);
            $table->string('description', 255)->nullable();
            $table->timestamps();

            $table->unique('type_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_types');
    }
};
