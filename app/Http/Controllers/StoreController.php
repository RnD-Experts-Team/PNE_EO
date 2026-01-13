<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
        return Inertia::render('Stores/Index', [
            'stores' => Store::orderBy('name')->paginate(20)->withQueryString(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Stores/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'manual_id' => ['required', 'string', 'max:50', 'unique:stores,manual_id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $store = Store::create($data);

        return redirect()->route('stores.show', $store);
    }

    public function show(Store $store)
    {
        $store->load(['expenses.expenseType']);

        return Inertia::render('Stores/Show', [
            'store' => $store,
        ]);
    }

    public function edit(Store $store)
    {
        return Inertia::render('Stores/Edit', [
            'store' => $store,
        ]);
    }

    public function update(Request $request, Store $store)
    {
        $data = $request->validate([
            'manual_id' => ['required', 'string', 'max:50', 'unique:stores,manual_id,' . $store->id],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $store->update($data);

        return redirect()->route('stores.show', $store);
    }

    public function destroy(Store $store)
    {
        $store->delete();

        return redirect()->route('stores.index');
    }
}
