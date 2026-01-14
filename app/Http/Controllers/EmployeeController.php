<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\Employee;
use App\Models\EmployeeStatus;
use App\Models\Store;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $statusId = $request->integer('status_id') ?: null;
        $tagId = $request->integer('tag_id') ?: null;

        $storeId = $request->integer('store_id') ?: null;

        $employees = Employee::query()
            ->with(['status', 'tags', 'employment.store'])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('preferred_name', 'like', "%{$search}%");
                });
            })
            ->when($statusId, fn($q) => $q->where('employee_status_id', $statusId))
            ->when($tagId, function ($q) use ($tagId) {
                $q->whereHas('tags', fn($tq) => $tq->where('tags.id', $tagId));
            })
            ->when($storeId, function ($q) use ($storeId) {
                $q->whereHas('employment', fn($eq) => $eq->where('store_id', $storeId));
            })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'statuses' => EmployeeStatus::orderBy('value')->get(['id', 'value']),
            'tags' => Tag::orderBy('tag_name')->get(['id', 'tag_name']),
            'stores' => Store::orderBy('name')->get(['id', 'name', 'manual_id']),
            'filters' => [
                'search' => $search,
                'status_id' => $statusId,
                'tag_id' => $tagId,
                'store_id' => $storeId,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create', [
            'statuses' => EmployeeStatus::orderBy('value')->get(['id', 'value']),
            'tags' => Tag::orderBy('tag_name')->get(['id', 'tag_name']),
            'stores' => Store::orderBy('name')->get(['id', 'name', 'manual_id']),
        ]);
    }

    public function store(EmployeeStoreRequest $request)
    {
        $data = $request->validated();

        $employee = DB::transaction(function () use ($data) {
            $employee = Employee::create([
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'last_name' => $data['last_name'],
                'preferred_name' => $data['preferred_name'] ?? null,
                'employee_status_id' => $data['employee_status_id'],
                'about_me' => $data['about_me'] ?? null,
            ]);

            $this->persistOneToOne($employee, $data);
            $this->persistHasMany($employee, $data);

            $employee->tags()->sync($data['tag_ids'] ?? []);

            return $employee;
        });

        return redirect()->route('employees.show', $employee);
    }

    public function show(Employee $employee)
    {
        $employee->load([
            'status',
            'contacts',
            'employment.store',
            'demographics',
            'identifiers',
            'addresses',
            'tags',
            'expenses.expenseType',
        ]);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/Edit', [
            'employee' => $employee->load([
                'status',
                'contacts',
                'employment.store',
                'demographics',
                'identifiers',
                'addresses',
                'tags',
            ]),
            'statuses' => EmployeeStatus::orderBy('value')->get(['id', 'value']),
            'tags' => Tag::orderBy('tag_name')->get(['id', 'tag_name']),
            'stores' => Store::orderBy('name')->get(['id', 'name', 'manual_id']),
        ]);
    }

    public function update(EmployeeUpdateRequest $request, Employee $employee)
    {
        $data = $request->validated();

        DB::transaction(function () use ($employee, $data) {
            $employee->update([
                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'last_name' => $data['last_name'],
                'preferred_name' => $data['preferred_name'] ?? null,
                'employee_status_id' => $data['employee_status_id'],
                'about_me' => $data['about_me'] ?? null,
            ]);

            $this->persistOneToOne($employee, $data, true);
            $this->persistHasMany($employee, $data, true);

            $employee->tags()->sync($data['tag_ids'] ?? []);
        });

        return redirect()->route('employees.show', $employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('employees.index');
    }

    private function persistOneToOne(Employee $employee, array $data, bool $isUpdate = false): void
    {
        // employment
        if (array_key_exists('employment', $data)) {
            $payload = $data['employment'] ?? [];

            // keep only known fields (prevents stray keys)
            $payload = [
                'store_id' => $payload['store_id'] ?? null,
                'hiring_date' => $payload['hiring_date'] ?? null,
            ];

            if ($this->hasAnyFilled($payload)) {
                $employee->employment()->updateOrCreate(
                    ['employee_id' => $employee->id],
                    $payload
                );
            } elseif ($isUpdate) {
                $employee->employment()->delete();
            }
        }

        // demographics
        if (array_key_exists('demographics', $data)) {
            $payload = $data['demographics'] ?? [];
            if ($this->hasAnyFilled($payload)) {
                $employee->demographics()->updateOrCreate(
                    ['employee_id' => $employee->id],
                    $payload
                );
            } elseif ($isUpdate) {
                $employee->demographics()->delete();
            }
        }

        // identifiers
        if (array_key_exists('identifiers', $data)) {
            $payload = $data['identifiers'] ?? [];
            if ($this->hasAnyFilled($payload)) {
                $employee->identifiers()->updateOrCreate(
                    ['employee_id' => $employee->id],
                    $payload
                );
            } elseif ($isUpdate) {
                $employee->identifiers()->delete();
            }
        }
    }

    private function persistHasMany(Employee $employee, array $data, bool $isUpdate = false): void
    {
        // contacts upsert + delete missing
        if (array_key_exists('contacts', $data)) {
            $items = $data['contacts'] ?? [];
            $keptIds = [];

            foreach ($items as $item) {
                // skip totally blank rows
                if (!$this->hasAnyFilled($item)) {
                    continue;
                }

                if (!empty($item['id'])) {
                    $contact = $employee->contacts()->whereKey($item['id'])->first();
                    if ($contact) {
                        $contact->update([
                            'contact_type' => $item['contact_type'] ?? null,
                            'contact_value' => $item['contact_value'] ?? null,
                            'is_primary' => (bool)($item['is_primary'] ?? false),
                        ]);
                        $keptIds[] = $contact->id;
                    }
                } else {
                    $contact = $employee->contacts()->create([
                        'contact_type' => $item['contact_type'] ?? null,
                        'contact_value' => $item['contact_value'] ?? null,
                        'is_primary' => (bool)($item['is_primary'] ?? false),
                    ]);
                    $keptIds[] = $contact->id;
                }
            }

            if ($isUpdate) {
                $employee->contacts()->whereNotIn('id', $keptIds)->delete();
            }
        }

        // addresses upsert + delete missing
        if (array_key_exists('addresses', $data)) {
            $items = $data['addresses'] ?? [];
            $keptIds = [];

            foreach ($items as $item) {
                if (!$this->hasAnyFilled($item)) {
                    continue;
                }

                $payload = [
                    'address_type' => $item['address_type'] ?? null,
                    'address_line1' => $item['address_line1'] ?? null,
                    'address_line2' => $item['address_line2'] ?? null,
                    'city' => $item['city'] ?? null,
                    'state' => $item['state'] ?? null,
                    'country' => $item['country'] ?? null,
                    'postal_code' => $item['postal_code'] ?? null,
                ];

                if (!empty($item['id'])) {
                    $address = $employee->addresses()->whereKey($item['id'])->first();
                    if ($address) {
                        $address->update($payload);
                        $keptIds[] = $address->id;
                    }
                } else {
                    $address = $employee->addresses()->create($payload);
                    $keptIds[] = $address->id;
                }
            }

            if ($isUpdate) {
                $employee->addresses()->whereNotIn('id', $keptIds)->delete();
            }
        }
    }

    private function hasAnyFilled(array $payload): bool
    {
        foreach ($payload as $k => $v) {
            if ($k === 'id') continue;
            if (is_bool($v)) return true;
            if ($v !== null && $v !== '') return true;
        }
        return false;
    }
}
