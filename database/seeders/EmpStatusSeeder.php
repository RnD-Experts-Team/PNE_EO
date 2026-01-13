<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpStatusSeeder extends Seeder
{
    public function run(): void
    {
        $values = [
            'Active',
            'Inactive',
            'On Leave',
            'Terminated',
        ];

        foreach ($values as $value) {
            DB::table('employee_statuses')->updateOrInsert(
                ['value' => $value],
                ['value' => $value]
            );
        }
    }
}
