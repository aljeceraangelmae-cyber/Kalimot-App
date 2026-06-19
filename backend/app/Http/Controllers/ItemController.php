<?php
namespace App\Http\Controllers;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    private function corsHeaders()
{
    return [
        'Access-Control-Allow-Origin'  => '*', // allow all for now, we'll restrict it after frontend is live
        'Access-Control-Allow-Methods' => 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Accept',
    ];
}

    public function index()
    {
        return response()->json(Item::latest()->get(), 200, $this->corsHeaders());
    }

    public function store(Request $request)
    {
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('items', 'public');
        }

        $item = Item::create([
            'name'          => $request->name,
            'description'   => $request->description,
            'location_note' => $request->location_note,
            'image_path'    => $imagePath,
        ]);

        return response()->json($item, 201, $this->corsHeaders());
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $items = Item::where('name', 'like', "%$query%")
                     ->latest()
                     ->get();
        return response()->json($items, 200, $this->corsHeaders());
    }

    public function suggest(Request $request)
    {
        $name = $request->get('name');
        $suggestion = Item::where('name', 'like', "%$name%")
            ->selectRaw('location_note, COUNT(*) as count')
            ->groupBy('location_note')
            ->orderByDesc('count')
            ->first();
        return response()->json($suggestion, 200, $this->corsHeaders());
    }

    public function destroy($id)
    {
        Item::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted'], 200, $this->corsHeaders());
    }

    public function options()
    {
        return response()->json('OK', 200, $this->corsHeaders());
    }
}