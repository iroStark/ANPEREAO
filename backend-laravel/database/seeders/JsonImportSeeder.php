<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;
use App\Models\Slideshow;
use App\Models\SocialOrgan;
use App\Models\ActivityPlanItem;

class JsonImportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Settings (Mission, Vision, etc)
        $settings = [
            'mission_text' => 'Promover o desenvolvimento e a excelência no sector das radiocomunicações em Angola, garantindo padrões elevados de qualidade e inovação.',
            'vision_text' => 'Ser a referência nacional e regional na regulação e promoção das telecomunicações, impulsionando a conectividade e o progresso tecnológico.',
            'history_text' => 'Fundada com o objetivo de unir os profissionais do espectro radioelétrico, a ANPERE tem desempenhado um papel crucial na evolução do setor em Angola...',
            'values_text' => '["Integridade", "Inovação", "Excelência", "Compromisso Social", "Transparência"]',
            'objectives_text' => '["Defender os interesses dos associados", "Promover a formação contínua", "Colaborar com o Estado na regulação", "Fomentar a inclusão digital"]',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 2. Slideshow
        $slides = [
            [
                'image_url' => '/assets/Telecommunications_tower_in_Luanda_Angola_da464df4.png',
                'title' => 'Conectando Angola ao Futuro',
                'subtitle' => 'Desenvolvimento e Inovação no Espectro Radioelétrico',
                'order_index' => 1,
                'active' => true,
            ],
            [
                'image_url' => '/assets/Angolan_telecommunications_professionals_working_640a21c0.png',
                'title' => 'Excelência Profissional',
                'subtitle' => 'Formação e certificação contínua para nossos associados',
                'order_index' => 2,
                'active' => true,
            ],
        ];

        foreach ($slides as $slide) {
            Slideshow::create($slide);
        }

        // 3. Members of Social Organs (Exemplo)
        SocialOrgan::create([
            'name' => 'Dr. João Manuel',
            'role' => 'Presidente da Direção',
            'organ_type' => 'direction',
            'image_url' => null,
            'mandate_years' => '2024-2027',
            'is_active' => true,
        ]);

        SocialOrgan::create([
            'name' => 'Eng. Maria Antónia',
            'role' => 'Presidente da Mesa da Assembleia',
            'organ_type' => 'general_assembly',
            'image_url' => null,
            'mandate_years' => '2024-2027',
            'is_active' => true,
        ]);

        // 4. Activity Plan Items (Exemplo)
        ActivityPlanItem::create([
            'title' => 'Conferência Nacional de Telecomunicações',
            'description' => 'Evento anual reunindo os maiores especialistas do setor para discutir o futuro do 5G em Angola.',
            'term' => 'Q2',
            'year' => '2025',
            'status' => 'planned',
        ]);

        ActivityPlanItem::create([
            'title' => 'Workshop de Certificação de Fibras Ópticas',
            'description' => 'Formação técnica para instaladores e projetistas de redes.',
            'term' => 'Q1',
            'year' => '2025',
            'status' => 'in_progress',
        ]);
    }
}
