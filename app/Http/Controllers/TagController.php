<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        return Inertia::render('Tags/Index', [
            'tags' => Tag::orderBy('tag_name')->paginate(30)->withQueryString(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tag_name' => ['required', 'string', 'max:100', 'unique:tags,tag_name'],
        ]);

        Tag::create($data);

        return redirect()->route('tags.index');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('tags.index');
    }
}
