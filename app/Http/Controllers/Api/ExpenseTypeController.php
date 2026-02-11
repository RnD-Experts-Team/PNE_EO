<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseTypeController extends Controller
{
    /**
     * List all expense types (active + soft deleted)
     */
    public function index()
    {//yes
        $expenseTypes = ExpenseType::withTrashed()
            ->orderBy('type_name')
            ->paginate(20);

        return response()->json([
            'data' => $expenseTypes,
        ]);
    }

    /**
     * Store new expense type
     */
    public function store(Request $request)
    {//yes
        $data = $request->validate([
            'type_name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('expense_types', 'type_name'),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $expenseType = ExpenseType::create($data);

        return response()->json([
            'message' => 'Expense type created successfully',
            'data'    => $expenseType,
        ], 201);
    }

    /**
     * Update expense type
     */
    public function update(Request $request, ExpenseType $expenseType)
    {//yes
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

        return response()->json([
            'message' => 'Expense type updated successfully',
            'data'    => $expenseType,
        ]);
    }

    /**
     * Soft delete expense type
     */
    public function destroy(ExpenseType $expenseType)
    {//yes
        $expenseType->delete();

        return response()->json([
            'message' => 'Expense type deleted successfully',
        ], 204);
    }

    /**
     * Restore soft-deleted expense type
     */
    public function restore(int $expenseType)
    {//yes
        $expenseType = ExpenseType::withTrashed()->findOrFail($expenseType);
        $expenseType->restore();

        return response()->json([
            'message' => 'Expense type restored successfully',
            'data'    => $expenseType,
        ]);
    }
}
