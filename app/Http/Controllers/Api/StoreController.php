<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {//yes
        $stores = Store::orderBy('name')
            ->paginate(20);

        return response()->json([
            'data' => $stores,
        ]);
    }

    public function store(Request $request)
    { //yes
        $data = $request->validate([
            'manual_id' => ['required', 'string', 'max:50', 'unique:stores,manual_id'],
            'name' => ['required', 'string', 'max:255'],

            'address_line1' => ['required', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:30'],
        ]);

        $store = Store::create($data);

        return response()->json([
            'message' => 'Store created successfully',
            'data' => $store,
        ], 201);
    }

    public function show(Store $store)
    {//yes
        $store->load(['expenses.expenseType']);

        return response()->json([
            'data' => $store,
        ]);
    }

    public function update(Request $request, Store $store)
    {//yes
        $data = $request->validate([
            'manual_id' => ['required', 'string', 'max:50', 'unique:stores,manual_id,' . $store->id],
            'name' => ['required', 'string', 'max:255'],

            'address_line1' => ['required', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:30'],
        ]);

        $store->update($data);

        return response()->json([
            'message' => 'Store updated successfully',
            'data' => $store,
        ]);
    }

    public function destroy(Store $store)
    {//yes
        $store->delete();

        return response()->json([
            'message' => 'Store deleted successfully',
        ], 204);
    }
}
