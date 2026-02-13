<?php

namespace App\Http\Controllers;

use App\Models\ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ExpenseTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('ExpenseTypes/Index', [
            // show BOTH active + soft-deleted
            'expenseTypes' => ExpenseType::withTrashed()
                ->orderBy('type_name')
                ->paginate(20)
                ->withQueryString(),
        ]);
    }

    public function create()
    {
        return Inertia::render('ExpenseTypes/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type_name' => [
                'required',
                'string',
                'max:150',
                // unique among NON-deleted only
                Rule::unique('expense_types', 'type_name'),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        ExpenseType::create($data);

        return redirect()->route('expense-types.index');
    }

    public function edit(ExpenseType $expenseType)
    {
        return Inertia::render('ExpenseTypes/Edit', [
            'expenseType' => $expenseType,
        ]);
    }

    public function update(Request $request, ExpenseType $expenseType)
    {
        $data = $request->validate([
            'type_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('expense_types', 'type_name')
                    ->ignore($expenseType->id)
                    ->whereNull('deleted_at'),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $expenseType->update($data);

        return redirect()->route('expense-types.index');
    }

    /**
     * Soft delete only.
     */
    public function destroy(ExpenseType $expenseType)
    {
        $expenseType->delete(); // ✅ soft delete
        return redirect()->route('expense-types.index');
    }

    /**
     * Restore soft-deleted expense type.
     */
    public function restore(int $expenseType)
    {
        ExpenseType::withTrashed()->findOrFail($expenseType)->restore();
        return redirect()->route('expense-types.index');
    }
}
