<?php
namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(Item::latest()->get());
    }

    public function store(Request $request)
    {
        $imageUrl = null;

        if ($request->hasFile('image')) {
            $base64Image = base64_encode(file_get_contents($request->file('image')->getRealPath()));

            $response = Http::asForm()->post('https://api.imgbb.com/1/upload', [
                'key'   => 'ae277167e24822e95193d06a07abf12f',
                'image' => $base64Image,
            ]);

            \Log::info('ImgBB response', ['body' => $response->body(), 'status' => $response->status()]);


            if ($response->successful()) {
                $imageUrl = $response->json('data.url');
            }
        }

        $item = Item::create([
            'name'          => $request->name,
            'description'   => $request->description,
            'location_note' => $request->location_note,
            'image_path'    => $imageUrl,
        ]);

        return response()->json($item, 201);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $items = Item::where('name', 'like', "%$query%")
                     ->latest()
                     ->get();
        return response()->json($items);
    }

    public function suggest(Request $request)
    {
        $name = $request->get('name');
        $suggestion = Item::where('name', 'like', "%$name%")
            ->selectRaw('location_note, COUNT(*) as count')
            ->groupBy('location_note')
            ->orderByDesc('count')
            ->first();
        return response()->json($suggestion);
    }

    public function destroy($id)
    {
        Item::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}