<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class GalleryImportSeeder extends Seeder
{
    public function run()
    {
        $sourceDir = '/Users/istark/Downloads/ANPERE/Galeria ANpere';

        // Target path: storage/app/public/gallery
        $targetDir = storage_path('app/public/gallery');

        // 1. Clean up existing data to prevent duplicates and mess
        DB::table('galleries')->truncate();

        // 2. Ensure clean target directory
        if (File::exists($targetDir)) {
            File::cleanDirectory($targetDir);
        } else {
            File::makeDirectory($targetDir, 0755, true);
        }

        // Get all files from source
        $files = glob($sourceDir . '/*.{jpg,jpeg,png,gif}', GLOB_BRACE);

        $categories = ['Eventos', 'Institucional', 'Social', 'Reuniões'];
        $titles = [
            'Confraternização de Membros',
            'Visita Institucional',
            'Assembleia Geral',
            'Acção Social',
            'Evento Técnico'
        ];

        $count = 0;
        foreach ($files as $filePath) {
            $originalFilename = basename($filePath);
            $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
            $nameWithoutExt = pathinfo($originalFilename, PATHINFO_FILENAME);

            // 3. Sanitize filename: remove special chars, spaces, etc.
            // Example: "WhatsApp Image... (1)" -> "whatsapp-image-2026-01-28-at-01-18-04-1"
            $safeName = Str::slug($nameWithoutExt) . '.' . $extension;

            $targetFilePath = $targetDir . '/' . $safeName;

            // Copy file
            File::copy($filePath, $targetFilePath);

            // Generate metadata
            $date = Carbon::now();
            if (preg_match('/(\d{4}-\d{2}-\d{2})/', $originalFilename, $matches)) {
                $date = Carbon::parse($matches[1]);
            }

            $category = $categories[array_rand($categories)];
            $baseTitle = $titles[array_rand($titles)];
            $title = $baseTitle . ' - ' . $date->format('d/m/Y');

            Gallery::create([
                'title' => $title,
                'description' => 'Registo fotográfico das actividades recentes da ANPERE.',
                'type' => 'image',
                'category' => $category,
                'date' => $date->format('Y-m-d'),
                // Store the relative path that allows access via the 'storage' symlink in public/
                'media_url' => '/storage/gallery/' . $safeName,
                'thumbnail' => '/storage/gallery/' . $safeName,
                'published_at' => now(),
                'views' => rand(10, 500)
            ]);
            $count++;
        }

        $this->command->info('Successfully imported ' . $count . ' images with sanitized filenames.');
    }
}
