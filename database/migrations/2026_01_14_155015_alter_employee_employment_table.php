<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('employee_employment', function (Blueprint $table) {
            // Add store_id (nullable) + FK to stores
            $table->foreignId('store_id')
                ->nullable()
                ->after('employee_id')
                ->constrained('stores')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // hiring_date was previously required; make it nullable to match your request rules
            $table->date('hiring_date')->nullable()->change();

            // Drop old string columns
            $table->dropColumn(['department', 'location', 'designation']);
        });
    }

    public function down(): void
    {
        Schema::table('employee_employment', function (Blueprint $table) {
            // Re-add old columns
            $table->string('department', 150)->after('employee_id');
            $table->string('location', 150)->after('department');
            $table->string('designation', 150)->after('location');

            // Revert hiring_date to NOT NULL (original)
            $table->date('hiring_date')->nullable(false)->change();

            // Drop FK + column
            $table->dropConstrainedForeignId('store_id');
        });
    }
};
