<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeExpense;
use App\Models\ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeExpenseController extends Controller
{
    public function create(Employee $employee)
    {
        return Inertia::render('Employees/Expenses/Create', [
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
            ],
            'expenseTypes' => ExpenseType::query()
                ->select('id', 'type_name')
                ->orderBy('type_name')
                ->get(),
        ]);
    }

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'expense_type_id' => ['required', 'integer', 'exists:expense_types,id'],
            'expense_info' => ['nullable', 'string'],
            'value' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'expense_date' => ['required', 'date'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240'], // 10MB each
        ]);

        $expense = EmployeeExpense::create([
            'employee_id' => $employee->id,
            'expense_type_id' => $validated['expense_type_id'],
            'expense_info' => $validated['expense_info'] ?? null,
            'value' => $validated['value'],
            'notes' => $validated['notes'] ?? null,
            'expense_date' => $validated['expense_date'],
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments', []) as $file) {
                $path = $file->store('attachments/employee-expenses', 'public');

                $expense->attachments()->create([
                    'path' => $path,
                ]);
            }
        }

        return redirect()
            ->route('employees.expenses.show', [$employee, $expense])
            ->with('success', 'Expense created.');
    }

    public function show(Employee $employee, EmployeeExpense $expense)
    {
        abort_unless($expense->employee_id === $employee->id, 404);

        $expense->load(['expenseType:id,type_name', 'attachments:id,attachable_id,attachable_type,path']);

        return Inertia::render('Employees/Expenses/Show', [
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
            ],
            'expense' => [
                'id' => $expense->id,
                'expense_date' => optional($expense->expense_date)->format('Y-m-d'),
                'value' => (string) $expense->value,
                'expense_info' => $expense->expense_info,
                'notes' => $expense->notes,
                'expense_type' => $expense->expenseType
                    ? ['id' => $expense->expenseType->id, 'type_name' => $expense->expenseType->type_name]
                    : null,
                'attachments' => $expense->attachments->map(fn($a) => [
                    'id' => $a->id,
                    'path' => $a->path,
                    'url' => Storage::disk('public')->url($a->path),
                    'filename' => basename($a->path),
                ])->values(),
            ],
        ]);
    }
}
