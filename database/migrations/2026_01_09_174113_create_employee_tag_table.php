<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_tag', function (Blueprint $table) {
            $table->foreignId('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->cascadeOnUpdate()->restrictOnDelete();
            $table->timestamps();

            $table->primary(['employee_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_tag');
    }
};
