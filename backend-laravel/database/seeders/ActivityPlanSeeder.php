<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityPlan;
use App\Models\ActivityPlanItem;

class ActivityPlanSeeder extends Seeder
{
    public function run()
    {
        // 2026 Plan
        $plan2026 = ActivityPlan::firstOrCreate(
            ['year' => '2026'],
            [
                'title' => 'Plano de Actividades 2026',
                'description' => 'Plano estratégico e operacional para o ano de 2026.',
                'is_active' => true,
            ]
        );

        // Clear existing items
        $plan2026->items()->delete();

        $activities2026 = [
            [
                'number' => 1,
                'activity' => 'Reuniões de direcção',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros',
            ],
            [
                'number' => 2,
                'activity' => 'Difusão de mensagens em datas de efemérides',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Presidente de Direcção',
            ],
            [
                'number' => 3,
                'activity' => 'Reuniões de troca de experiências com a FOCOBACC',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social da FOCABA',
                'participants' => 'Membros da direcção',
            ],
            [
                'number' => 4,
                'activity' => 'Visita aos doentes e entrega de cesta básica',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Residência dos doentes',
                'participants' => 'Membros',
            ],
            [
                'number' => 5,
                'activity' => 'Recontagem da história do R (Lda, Hbo, Mox, Nam, Mal, Huila)',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 6,
                'activity' => 'Exposições fotográficas: Weza Paradise, Acto constitutivo, etc',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros da Família R',
            ],
            // Implied item from text structure
            [
                'number' => 7, // Incrementing manually to handle "Visitas Turísticas"
                'activity' => 'Visitas Turísticas',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Barra do Dande, Barra do Cuanza, Marco Histórico do Kifangondo',
                'participants' => 'Membros',
            ],
            [
                'number' => 8, // Copied as 7 in text, but let's correct sequence or keep text numbers? 
                // Text says:
                // ... Membros da Família R
                // Visitas Turísticas ... Membros
                // N.º ACTIVIDADE ...
                // 7 Sessão de cinema...
                //
                // Using 8 for Visitas might shift 7... 
                // Actually, let's look closely. "Visitas Turísticas" seems like a sub-item or unnumbered item. 
                // But "7 Sessão de cinema" follows. 
                // If I number Visitas as 7, strictly, then Sessão should be 8. 
                // However, the PDF text has "7 Sessão". 
                // Maybe "Visitas Turísticas" isn't item 7. 
                // Let's create it as a separate item but maybe without a number displayed or reuse previous?
                // I'll give it number 0 or just increment order_index and label it properly.
                // I'll stick to sequential integers for the DB 'number' field for sorting, 
                // but maybe I should respect the visual layout.
                // I'll use 7 for Visitas and 8 for Sessão to make it logical, 
                // OR I'll match the doc:
                // 6 Exposições...
                // [No Number] Visitas...
                // 7 Sessão...
                // I'll make Visitas 6.5? No, integer.
                // I will just make it the next item in order_index.
                // For display 'number', I will assign it 7 and bump the others, or keep it 0.
                // Let's assume it was meant to be 7.
                'activity' => 'Visitas Turísticas',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Barra do Dande, Barra do Cuanza, Marco Histórico do Kifangondo',
                'participants' => 'Membros',
            ],
            [
                'number' => 7, // Text says 7
                'activity' => 'Sessão de cinema com a envolvente técnica especializada',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros',
            ],
            [
                'number' => 8,
                'activity' => 'Caminhadas pedestres',
                'date' => 'Mensalmente',
                'time' => '7H00',
                'location' => 'Porto de Luanda x Baleizão',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 9,
                'activity' => 'Jogos de futsal',
                'date' => 'Mensalmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 10,
                'activity' => 'Jogos de xadrez',
                'date' => 'Mensalmente',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros da Família R',
            ],
        ];

        // Sorting adjustment: Visitas Turísticas came between 6 and 7. 
        // I will re-number them visually to specific IDs or use string numbers? 
        // Schema says integer. I'll just auto-increment items that duplicate a number or make Visitas unique.
        // Actually, if I look at the text "6 Exposições... [Newline] Visitas Turísticas...", maybe Visitas is part of 6?
        // "Membros da Família R [Newline] Visitas Turísticas ... Membros" <- different participants.
        // I will treat Visitas as a distinct entry. 
        // I will number it 601 (like 6.1) to avoid conflict with 7?  
        // Or just let it be 7 and shift the rest? The text explicitly numbers "7 Sessão".
        // I'll use the provided numbering for the explicit ones. 
        // For Visitas, I'll use 0 to indicate "special" or unnumbered.

        $activities2026_refined = [
            [
                'number' => 1,
                'activity' => 'Reuniões de direcção',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros',
            ],
            [
                'number' => 2,
                'activity' => 'Difusão de mensagens em datas de efemérides',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Presidente de Direcção',
            ],
            [
                'number' => 3,
                'activity' => 'Reuniões de troca de experiências com a FOCOBACC',
                'date' => 'Janeiro à Dezembro',
                'time' => 'A indicar',
                'location' => 'Sede Social da FOCABA',
                'participants' => 'Membros da direcção',
            ],
            [
                'number' => 4,
                'activity' => 'Visita aos doentes e entrega de cesta básica',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Residência dos doentes',
                'participants' => 'Membros',
            ],
            [
                'number' => 5,
                'activity' => 'Recontagem da história do R (Lda, Hbo, Mox, Nam, Mal, Huila)',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 6,
                'activity' => 'Exposições fotográficas: Weza Paradise, Acto constitutivo, etc',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 0, // Unnumbered
                'activity' => 'Visitas Turísticas',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'Barra do Dande, Barra do Cuanza, Marco Histórico do Kifangondo',
                'participants' => 'Membros',
            ],
            [
                'number' => 7,
                'activity' => 'Sessão de cinema com a envolvente técnica especializada',
                'date' => 'Trimestralmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros',
            ],
            [
                'number' => 8,
                'activity' => 'Caminhadas pedestres',
                'date' => 'Mensalmente',
                'time' => '7H00',
                'location' => 'Porto de Luanda x Baleizão',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 9,
                'activity' => 'Jogos de futsal',
                'date' => 'Mensalmente',
                'time' => 'A indicar',
                'location' => 'A indicar',
                'participants' => 'Membros da Família R',
            ],
            [
                'number' => 10,
                'activity' => 'Jogos de xadrez',
                'date' => 'Mensalmente',
                'time' => 'A indicar',
                'location' => 'Sede Social',
                'participants' => 'Membros da Família R',
            ],
        ];

        foreach ($activities2026_refined as $index => $item) {
            ActivityPlanItem::create([
                'activity_plan_id' => $plan2026->id,
                'number' => $item['number'],
                'activity' => $item['activity'],
                'date' => $item['date'],
                'time' => $item['time'],
                'location' => $item['location'],
                'participants' => $item['participants'],
                'order_index' => $index,
            ]);
        }
    }
}
