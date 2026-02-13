<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DayNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DayNoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'note_date' => 'required|date',
            'content' => 'required|string',
        ]);

        $note = DayNote::updateOrCreate(
            ['note_date' => $validated['note_date']],
            [
                'content' => $validated['content'],
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]
        );

        return response()->json([
            'message' => 'Note saved successfully',
            'data' => $note,
        ], 200);
    }

    public function destroy(DayNote $note)
    {
        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully',
        ], 200);
    }
}
