<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Slideshow;
use Illuminate\Support\Facades\File;

class SlideshowSeeder extends Seeder
{
    public function run()
    {
        $storagePath = storage_path('app/public/slideshows');
        if (!File::exists($storagePath)) {
            File::makeDirectory($storagePath, 0755, true);
        }

        // Define slides to import (Skipping the first one as requested)
        $slides = [
            [
                'source' => '/Users/istark/Downloads/ANPERE/react-app/attached_assets/generated_images/Telecommunications_tower_in_Luanda_Angola_da464df4.png',
                'filename' => 'slide_tower.png',
                'title' => 'Tecnologia e Inovação',
                'subtitle' => 'Avançando nas telecomunicações angolanas',
                'order' => 1
            ],
            [
                'source' => '/Users/istark/Downloads/ANPERE/react-app/attached_assets/IMG-20240214-WA0082_1759411408988.jpg',
                'filename' => 'slide_members.jpg',
                'title' => 'Membros da ANPERE',
                'subtitle' => 'Unidos pela profissão',
                'order' => 2
            ],
            [
                'source' => '/Users/istark/Downloads/ANPERE/react-app/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758927089316.png',
                'filename' => 'slide_assembly.png',
                'title' => 'Assembleia de Constituição da ANPERE',
                'subtitle' => 'Unidade e determinação dos profissionais',
                'order' => 3
            ]
        ];

        Slideshow::truncate();

        foreach ($slides as $slide) {
            if (File::exists($slide['source'])) {
                File::copy($slide['source'], $storagePath . '/' . $slide['filename']);

                Slideshow::create([
                    'title' => $slide['title'],
                    'subtitle' => $slide['subtitle'],
                    'image_url' => '/storage/slideshows/' . $slide['filename'],
                    'order_index' => $slide['order'],
                    'active' => true,
                    // 'link' => '' // Schema has link, we can leave null or set generic
                ]);

                $this->command->info("Imported slide: {$slide['title']}");
            } else {
                $this->command->error("Source file not found: {$slide['source']}");
            }
        }
    }
}
