<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::orderBy('tag_name')
            ->paginate(30);

        return response()->json([
            'data' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tag_name' => ['required', 'string', 'max:100', 'unique:tags,tag_name'],
        ]);

        $tag = Tag::create($data);

        return response()->json([
            'message' => 'Tag created successfully',
            'data'    => $tag,
        ], 201);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json([
            'message' => 'Tag deleted successfully',
        ], 204);
    }
}
