use Illuminate\Support\Facades\Http;

public function store(Request $request)
{
    $imageUrl = null;

    if ($request->hasFile('image')) {
        $base64Image = base64_encode(file_get_contents($request->file('image')->getRealPath()));

        $response = Http::asForm()->post('https://api.imgbb.com/1/upload', [
            'key'   => env('IMGBB_API_KEY'),
            'image' => $base64Image,
        ]);

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