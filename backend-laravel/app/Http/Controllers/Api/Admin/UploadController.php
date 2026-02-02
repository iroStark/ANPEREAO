<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json([
                'message' => 'The file field is required.',
                'errors' => ['file' => ['No file was sent or the file exceeds PHP upload limits.']]
            ], 422);
        }

        $file = $request->file('file');
        if (!$file->isValid()) {
            return response()->json([
                'message' => 'The file failed to upload.',
                'errors' => ['file' => ['PHP Upload Error: ' . $file->getErrorMessage()]]
            ], 422);
        }

        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB
        ]);

        $path = $file->store('uploads', 'public');
        $url = asset('storage/' . $path);

        return response()->json(['url' => $url], 200);
    }
}
