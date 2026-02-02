<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LegislationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Legislation::create([
            'title' => 'Estatutos da ANPERE',
            'description' => 'Estatutos oficiais da Associação Nacional de Peritos em Regulação de Energia.',
            'category' => 'Estatutos',
            'year' => '2025',
            'icon' => 'Scale',
            'content' => '<p>Conteúdo dos estatutos...</p>',
            'file_url' => '/assets/docs/estatutos.pdf',
            'published_at' => now(),
        ]);

        \App\Models\Legislation::create([
            'title' => 'Lei Geral da Eletricidade',
            'description' => 'Lei que regula o setor elétrico nacional.',
            'category' => 'Leis',
            'year' => '2024',
            'icon' => 'BookOpen',
            'content' => '<p>Conteúdo da lei...</p>',
            'file_url' => '/assets/docs/lei_eletricidade.pdf',
            'published_at' => now()->subMonths(6),
        ]);
    }
}
