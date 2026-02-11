<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreExpense;
use App\Models\ExpenseType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StoreExpenseController extends Controller
{
    public function create(Store $store)
    {//yes
        return response()->json([
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'expense_types' => ExpenseType::query()
                ->select('id', 'type_name')
                ->orderBy('type_name')
                ->get(),
        ]);
    }

    public function store(Request $request, Store $store)
    {//YES
        $validated = $request->validate([
            'expense_type_id' => ['required', 'integer', 'exists:expense_types,id'],
            'expense_info' => ['nullable', 'string'],
            'value' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'expense_date' => ['required', 'date'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240'], // 10MB each
        ]);

        $expense = StoreExpense::create([
            'store_id' => $store->id,
            'expense_type_id' => $validated['expense_type_id'],
            'expense_info' => $validated['expense_info'] ?? null,
            'value' => $validated['value'],
            'notes' => $validated['notes'] ?? null,
            'expense_date' => $validated['expense_date'],
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments', []) as $file) {
                $path = $file->store('attachments/store-expenses', 'public');

                $expense->attachments()->create([
                    'path' => $path,
                ]);
            }
        }

        $expense->load(['expenseType:id,type_name', 'attachments:id,attachable_id,attachable_type,path']);

        return response()->json([
            'message' => 'Expense created successfully.',
            'data' => $this->formatExpense($expense),
        ], 201);
    }

    public function show(Store $store, StoreExpense $expense)
    {//YES
        if ($expense->store_id !== $store->id) {
            return response()->json([
                'message' => 'Expense not found.'
            ], 404);
        }

        $expense->load(['expenseType:id,type_name', 'attachments:id,attachable_id,attachable_type,path']);

        return response()->json([
            'data' => $this->formatExpense($expense),
        ]);
    }

    private function formatExpense(StoreExpense $expense)
    {
        return [
            'id' => $expense->id,
            'store_id' => $expense->store_id,
            'expense_date' => optional($expense->expense_date)->format('Y-m-d'),
            'value' => (string) $expense->value,
            'expense_info' => $expense->expense_info,
            'notes' => $expense->notes,
            'expense_type' => $expense->expenseType
                ? [
                    'id' => $expense->expenseType->id,
                    'type_name' => $expense->expenseType->type_name,
                ]
                : null,
            'attachments' => $expense->attachments->map(function ($a) {
                return [
                    'id' => $a->id,
                    'path' => $a->path,
                    'url' => Storage::disk('public')->url($a->path),
                    'filename' => basename($a->path),
                ];
            })->values(),
        ];
    }
}
