<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('address_line1', 255)->after('name');
            $table->string('address_line2', 255)->nullable()->after('address_line1');
            $table->string('city', 100)->after('address_line2');
            $table->string('state', 100)->after('city');
            $table->string('country', 100)->after('state');
            $table->string('postal_code', 30)->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'address_line1',
                'address_line2',
                'city',
                'state',
                'country',
                'postal_code',
            ]);
        });
    }
};
