<?php

namespace Database\Seeders;

use App\Models\Attachment;
use App\Models\EmployeeStatus;
use App\Models\Employee;
use App\Models\EmployeeAddress;
use App\Models\EmployeeContact;
use App\Models\EmployeeDemographics;
use App\Models\EmployeeEmployment;
use App\Models\EmployeeExpense;
use App\Models\EmployeeIdentifiers;
use App\Models\ExpenseType;
use App\Models\Store;
use App\Models\StoreExpense;
use App\Models\Tag;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // ----- SETTINGS -----
        $employeeCount = 60;
        $storeCount = 12;
        $expenseTypesCount = 18;
        $tagCount = 22;

        DB::transaction(function () use (
            $faker,
            $employeeCount,
            $storeCount,
            $expenseTypesCount,
            $tagCount
        ) {
            // ---------------------------
            // EMP STATUSES
            // ---------------------------
            $this->call(EmpStatusSeeder::class);
            $statusIds = EmployeeStatus::query()->pluck('id')->all(); // ✅ DB uses id

            // ---------------------------
            // TAGS
            // ---------------------------
            $tagNames = collect([
                'Manager',
                'Supervisor',
                'Cashier',
                'Warehouse',
                'Sales',
                'HR',
                'Finance',
                'Operations',
                'IT',
                'Marketing',
                'Part-time',
                'Full-time',
                'Remote',
                'On-site',
                'Trainer',
                'New Hire',
                'Veteran',
                'Night Shift',
                'Day Shift',
                'Contractor',
                'Intern',
                'Team Lead',
            ])->shuffle()->take($tagCount)->values();

            $tags = $tagNames->map(fn($name) => Tag::query()->firstOrCreate(['tag_name' => $name]));
            $tagIds = $tags->pluck('id')->all();

            // ---------------------------
            // EXPENSE TYPES
            // ---------------------------
            $baseExpenseTypes = [
                ['type_name' => 'Travel', 'description' => 'Flights, rides, mileage, lodging'],
                ['type_name' => 'Meals', 'description' => 'Meals during work travel or overtime'],
                ['type_name' => 'Office Supplies', 'description' => 'Stationery, printer ink, small supplies'],
                ['type_name' => 'Equipment', 'description' => 'Hardware, peripherals, tools'],
                ['type_name' => 'Training', 'description' => 'Courses, certifications, learning materials'],
                ['type_name' => 'Uniforms', 'description' => 'Uniforms or branded apparel'],
                ['type_name' => 'Repairs', 'description' => 'Repairs and maintenance'],
                ['type_name' => 'Utilities', 'description' => 'Electricity, water, internet, etc.'],
                ['type_name' => 'Marketing', 'description' => 'Ads, signage, promo materials'],
                ['type_name' => 'Misc', 'description' => 'Other small expenses'],
            ];

            foreach ($baseExpenseTypes as $row) {
                ExpenseType::query()->firstOrCreate(
                    ['type_name' => $row['type_name']],
                    ['description' => $row['description']]
                );
            }

            while (ExpenseType::query()->count() < $expenseTypesCount) {
                $name = Str::title($faker->unique()->words(2, true));
                ExpenseType::query()->create([
                    'type_name' => $name,
                    'description' => $faker->sentence(),
                ]);
            }

            $expenseTypeIds = ExpenseType::query()->pluck('id')->all(); // ✅ DB uses id

            // ---------------------------
            // STORES (NOW WITH LOCATION FIELDS)
            // ---------------------------
            for ($i = 1; $i <= $storeCount; $i++) {
                $state = $faker->stateAbbr();
                $city = $faker->city();

                Store::query()->create([
                    'manual_id' => 'S-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                    'name' => $faker->company() . ' Store',

                    'address_line1' => $faker->streetAddress(),
                    'address_line2' => $faker->boolean(30) ? $faker->secondaryAddress() : null,
                    'city' => $city,
                    'state' => $state,
                    'country' => 'United States',
                    'postal_code' => $faker->postcode(),
                ]);
            }

            $storeIds = Store::query()->pluck('id')->all(); // ✅ DB uses id

            // ---------------------------
            // EMPLOYEES + RELATED TABLES
            // ---------------------------
            $employeeIds = [];

            for ($i = 1; $i <= $employeeCount; $i++) {
                $first = $faker->firstName();
                $last = $faker->lastName();
                $preferred = $faker->boolean(30) ? $faker->firstName() : $first;

                $employee = Employee::query()->create([
                    // ✅ DB uses employees.id, do NOT set employee_id manually
                    'first_name' => $first,
                    'middle_name' => $faker->boolean(60) ? $faker->firstName() : 'N/A',
                    'last_name' => $last,
                    'preferred_name' => $preferred,
                    'employee_status_id' => $faker->randomElement($statusIds), // ✅ correct FK column
                    'about_me' => $faker->boolean(70) ? $faker->sentence(12) : null,
                ]);

                $employeeIds[] = $employee->id;

                // Contacts (work email always + optional phone)
                EmployeeContact::query()->create([
                    'employee_id' => $employee->id,
                    'contact_type' => 'work_email',
                    'contact_value' => Str::lower($first . '.' . $last) . "+{$employee->id}@example.com",
                    'is_primary' => true,
                ]);

                if ($faker->boolean(80)) {
                    EmployeeContact::query()->create([
                        'employee_id' => $employee->id,
                        'contact_type' => 'work_phone',
                        'contact_value' => $faker->phoneNumber(),
                        'is_primary' => $faker->boolean(50),
                    ]);
                }

                // Employment (NOW LINKS TO store_id)
                $hireDate = Carbon::today()->subDays($faker->numberBetween(30, 3650)); // 1 month to 10 years

                EmployeeEmployment::query()->create([
                    'employee_id' => $employee->id,
                    'store_id' => $faker->randomElement($storeIds),
                    'hiring_date' => $hireDate->toDateString(),
                ]);

                // Demographics
                $dob = Carbon::today()
                    ->subYears($faker->numberBetween(19, 60))
                    ->subDays($faker->numberBetween(0, 365));

                EmployeeDemographics::query()->create([
                    'employee_id' => $employee->id,
                    'date_of_birth' => $dob->toDateString(),
                    'gender' => $faker->randomElement(['Male', 'Female']),
                    'marital_status' => $faker->randomElement(['Single', 'Divorced', 'Married', 'Widowed']),
                    'veteran_status' => $faker->boolean(12),
                ]);

                // Identifiers (fake-ish)
                EmployeeIdentifiers::query()->create([
                    'employee_id' => $employee->id,
                    'social_security_number' => $this->fakeSsn($employee->id),
                    'national_id_number' => 'NID-' . strtoupper(Str::random(10)) . '-' . $employee->id,
                    'itin' => 'ITIN-' . $faker->numerify('#########'),
                ]);

                // Address (present)
                EmployeeAddress::query()->create([
                    'employee_id' => $employee->id,
                    'address_type' => 'present',
                    'address_line1' => $faker->streetAddress(),
                    'address_line2' => $faker->boolean(30) ? $faker->secondaryAddress() : 'N/A',
                    'city' => $faker->city(),
                    'state' => $faker->state(),
                    'country' => 'United States',
                    'postal_code' => $faker->postcode(),
                ]);

                // Employee tags pivot (2–6 tags per employee)
                $pick = collect($tagIds)->shuffle()->take($faker->numberBetween(2, 6))->values();
                foreach ($pick as $tagId) {
                    // ✅ DB pivot table name: employee_tag (NOT employee_tags)
                    DB::table('employee_tag')->updateOrInsert(
                        ['employee_id' => $employee->id, 'tag_id' => $tagId],
                        ['employee_id' => $employee->id, 'tag_id' => $tagId]
                    );
                }
            }

            // ---------------------------
            // EMPLOYEE EXPENSES + ATTACHMENTS
            // ---------------------------
            foreach ($employeeIds as $employeeId) {
                $expenseCount = $faker->numberBetween(1, 10);

                for ($i = 0; $i < $expenseCount; $i++) {
                    $expenseDate = Carbon::today()->subDays($faker->numberBetween(0, 120));

                    $expense = EmployeeExpense::query()->create([
                        'employee_id' => $employeeId,
                        'expense_type_id' => $faker->randomElement($expenseTypeIds),
                        'expense_info' => $faker->sentence(8),
                        'value' => $faker->randomFloat(2, 5, 500),
                        'notes' => $faker->boolean(70) ? $faker->sentence(10) : 'N/A',
                        'expense_date' => $expenseDate->toDateString(),
                    ]);

                    // 0–2 attachments
                    $attCount = $faker->numberBetween(0, 2);
                    for ($a = 0; $a < $attCount; $a++) {
                        Attachment::query()->create([
                            'attachable_type' => EmployeeExpense::class,
                            'attachable_id' => $expense->id, // ✅ DB PK is id
                            'path' => 'uploads/receipts/' . Str::uuid() . '.jpg',
                        ]);
                    }
                }
            }

            // ---------------------------
            // STORE EXPENSES + ATTACHMENTS
            // ---------------------------
            foreach ($storeIds as $storeId) {
                $expenseCount = $faker->numberBetween(6, 20);

                for ($i = 0; $i < $expenseCount; $i++) {
                    $expenseDate = Carbon::today()->subDays($faker->numberBetween(0, 180));

                    $expense = StoreExpense::query()->create([
                        'store_id' => $storeId,
                        'expense_type_id' => $faker->randomElement($expenseTypeIds),
                        'expense_info' => $faker->sentence(8),
                        'value' => $faker->randomFloat(2, 20, 2500),
                        'notes' => $faker->boolean(70) ? $faker->sentence(10) : 'N/A',
                        'expense_date' => $expenseDate->toDateString(),
                    ]);

                    // 0–3 attachments
                    $attCount = $faker->numberBetween(0, 3);
                    for ($a = 0; $a < $attCount; $a++) {
                        Attachment::query()->create([
                            'attachable_type' => StoreExpense::class,
                            'attachable_id' => $expense->id, // ✅ DB PK is id
                            'path' => 'uploads/store-receipts/' . Str::uuid() . '.pdf',
                        ]);
                    }
                }
            }
        });
    }

    private function fakeSsn(int $seed): string
    {
        // Not real; deterministic-ish to avoid uniqueness conflicts
        $a = 100 + ($seed % 899);      // 100-998
        $b = 10 + ($seed % 89);        // 10-98
        $c = 1000 + ($seed % 8999);    // 1000-9998
        return sprintf('%03d-%02d-%04d', $a, $b, $c);
    }
}
