<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MilestoneTemplate;
use Illuminate\Http\Request;

class MilestoneTemplateController extends Controller
{
    public function index()
    {
        $templates = MilestoneTemplate::orderBy('milestone_type')
            ->orderBy('sort_order')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'milestone_type' => $t->milestone_type,
                'value' => $t->value,
                'unit' => $t->unit,
                'is_active' => $t->is_active,
                'sort_order' => $t->sort_order,
                'display_name' => $t->display_name,
            ]);

        return response()->json([
            'data' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'milestone_type' => 'required|in:birthday,hiring_anniversary',
            'value' => 'required|integer|min:1',
            'unit' => 'required|in:days,weeks,months,years',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $exists = MilestoneTemplate::where('milestone_type', $validated['milestone_type'])
            ->where('value', $validated['value'])
            ->where('unit', $validated['unit'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'duplicate' => ['This milestone already exists.']
                ],
            ], 422);
        }

        if (!isset($validated['sort_order'])) {
            $maxSort = MilestoneTemplate::where('milestone_type', $validated['milestone_type'])
                ->max('sort_order');
            $validated['sort_order'] = ($maxSort ?? 0) + 1;
        }

        $template = MilestoneTemplate::create($validated);

        return response()->json([
            'message' => 'Milestone template created successfully.',
            'data' => [
                'id' => $template->id,
                'milestone_type' => $template->milestone_type,
                'value' => $template->value,
                'unit' => $template->unit,
                'is_active' => $template->is_active,
                'sort_order' => $template->sort_order,
                'display_name' => $template->display_name,
            ],
        ], 201);
    }

    public function update(Request $request, MilestoneTemplate $template)
    {
        $validated = $request->validate([
            'milestone_type' => 'required|in:birthday,hiring_anniversary',
            'value' => 'required|integer|min:1',
            'unit' => 'required|in:days,weeks,months,years',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $exists = MilestoneTemplate::where('milestone_type', $validated['milestone_type'])
            ->where('value', $validated['value'])
            ->where('unit', $validated['unit'])
            ->where('id', '!=', $template->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'duplicate' => ['This milestone already exists.']
                ],
            ], 422);
        }

        $template->update($validated);

        return response()->json([
            'message' => 'Milestone template updated successfully.',
            'data' => [
                'id' => $template->id,
                'milestone_type' => $template->milestone_type,
                'value' => $template->value,
                'unit' => $template->unit,
                'is_active' => $template->is_active,
                'sort_order' => $template->sort_order,
                'display_name' => $template->display_name,
            ],
        ]);
    }

    public function destroy(MilestoneTemplate $template)
    {
        $template->delete();

        return response()->json([
            'message' => 'Milestone template deleted successfully.',
        ]);
    }
}
