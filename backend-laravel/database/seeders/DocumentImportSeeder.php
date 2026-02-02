<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\Legislation;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocumentImportSeeder extends Seeder
{
    public function run()
    {
        // 1. Setup Source Files
        $reportsSource = '/Users/istark/Downloads/ANPERE/RELATÓRIO E CONTAS 2024 - 2025.pdf';
        $statutesSource = '/Users/istark/Downloads/ANPERE/ESTATUTOS REVISTOS JUNHO DE 2025_VERSÃO SEM RODAPÉ.pdf';

        // 2. Setup Target Directories
        $reportsDir = storage_path('app/public/reports');
        $legislationDir = storage_path('app/public/legislation');

        if (!File::exists($reportsDir)) {
            File::makeDirectory($reportsDir, 0755, true);
        }
        if (!File::exists($legislationDir)) {
            File::makeDirectory($legislationDir, 0755, true);
        }

        // Clean tables to prevent duplicates
        DB::table('reports')->truncate();
        DB::table('legislations')->truncate();

        // 3. Import Report
        if (File::exists($reportsSource)) {
            $reportFilename = 'relatorio-e-contas-2024-2025.pdf';
            $reportTarget = $reportsDir . '/' . $reportFilename;

            File::copy($reportsSource, $reportTarget);

            try {
                $report = new Report();
                $report->title = 'Relatório e Contas 2024 - 2025';
                $report->description = 'Relatório e contas oficial da ANPERE respectivo ao período 2024-2025.';
                $report->type = 'Relatório e Contas';
                $report->status = 'published';
                $report->period = '2024/2025';
                $report->file_url = '/storage/reports/' . $reportFilename;
                $report->save();

                $this->command->info('Processed Report: ' . $reportFilename . ' with URL: ' . $report->file_url);
            } catch (\Exception $e) {
                $this->command->error('Error creating report: ' . $e->getMessage());
            }
        } else {
            $this->command->error('Source file not found: ' . $reportsSource);
        }

        // 4. Import Statutes (Legislation)
        if (File::exists($statutesSource)) {
            $statutesFilename = 'estatutos-revistos-junho-2025.pdf';
            $statutesTarget = $legislationDir . '/' . $statutesFilename;

            File::copy($statutesSource, $statutesTarget);

            try {
                Legislation::create([
                    'title' => 'Estatutos Revistos 2025',
                    'description' => 'Estatutos da ANPERE revistos em Junho de 2025.',
                    'category' => 'Estatuto',
                    'year' => '2025',
                    'icon' => 'BookOpen',
                    'file_url' => '/storage/legislation/' . $statutesFilename,
                    'published_at' => Carbon::now(),
                ]);
                $this->command->info('Processed Statute: ' . $statutesFilename);
            } catch (\Exception $e) {
                $this->command->error('Error creating legislation: ' . $e->getMessage());
            }
        } else {
            $this->command->error('Source file not found: ' . $statutesSource);
        }
    }
}
