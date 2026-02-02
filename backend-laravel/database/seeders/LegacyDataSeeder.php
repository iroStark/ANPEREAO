<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Gallery;
use App\Models\Event;
use App\Models\Legislation;
use App\Models\Publication;
use App\Models\AboutContent;
use App\Models\Member;
use App\Models\ContactMessage;
use App\Models\SocialOrgao;
use App\Models\ActivityPlan;
use App\Models\Notification;
use App\Models\Report;
use Carbon\Carbon;

class LegacyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('../react-app/data');

        // 1. Users
        $this->seedUsers($jsonPath);

        // 2. Gallery
        $this->seedGallery($jsonPath);

        // 3. Events
        $this->seedEvents($jsonPath);

        // 4. Legislation
        $this->seedLegislation($jsonPath);

        // 5. Publications
        $this->seedPublications($jsonPath);

        // 6. About Content
        $this->seedAboutContent($jsonPath);

        // 7. Reports
        $this->seedReports($jsonPath);
    }

    private function getJson($path, $filename)
    {
        $file = $path . '/' . $filename;
        if (File::exists($file)) {
            return json_decode(File::get($file), true) ?? [];
        }
        return [];
    }

    private function seedUsers($path)
    {
        $users = $this->getJson($path, 'users.json');
        foreach ($users as $user) {
            $existing = User::where('username', $user['username'])->first();
            if (!$existing) {
                User::create([
                    'name' => $user['username'],
                    'username' => $user['username'],
                    'email' => $user['email'] ?? $user['username'] . '@example.com',
                    'password' => Hash::make('admin123'),
                    'role' => $user['role'] ?? 'user',
                    'is_active' => $user['isActive'] ?? true,
                ]);
            }
        }
    }

    private function seedGallery($path)
    {
        $items = $this->getJson($path, 'gallery.json');
        foreach ($items as $item) {
            Gallery::create([
                'title' => $item['title'],
                'description' => $item['description'],
                'type' => $item['type'],
                'date' => $item['date'],
                'category' => $item['category'],
                'views' => $item['views'] ?? 0,
                'duration' => $item['duration'] ?? null,
                'thumbnail' => $item['thumbnail'] ?? null,
                'media_url' => $item['mediaUrl'],
                'published_at' => isset($item['publishedAt']) ? Carbon::parse($item['publishedAt']) : now(),
            ]);
        }
    }

    private function seedEvents($path)
    {
        $items = $this->getJson($path, 'events.json');
        foreach ($items as $item) {
            Event::create([
                'title' => $item['title'],
                'description' => $item['description'],
                'date' => $item['date'],
                'time' => $item['time'],
                'location' => $item['location'],
                'type' => $item['type'],
                'capacity' => $item['capacity'] ?? null,
                'registration_url' => $item['registrationUrl'] ?? null,
                'published_at' => isset($item['publishedAt']) ? Carbon::parse($item['publishedAt']) : now(),
            ]);
        }
    }

    private function seedLegislation($path)
    {
        $items = $this->getJson($path, 'legislation.json');
        foreach ($items as $item) {
            Legislation::create([
                'title' => $item['title'],
                'description' => $item['description'],
                'category' => $item['category'],
                'year' => $item['year'],
                'icon' => $item['icon'],
                'file_url' => $item['fileUrl'] ?? null,
                'published_at' => isset($item['publishedAt']) ? Carbon::parse($item['publishedAt']) : now(),
            ]);
        }
    }

    private function seedPublications($path)
    {
        $items = $this->getJson($path, 'publications.json');
        foreach ($items as $item) {
            Publication::create([
                'title' => $item['title'],
                'description' => $item['description'],
                'category' => $item['category'],
                'date' => $item['date'],
                'file_url' => $item['fileUrl'] ?? null,
                'download_url' => $item['downloadUrl'] ?? null,
                'published_at' => isset($item['publishedAt']) ? Carbon::parse($item['publishedAt']) : now(),
            ]);
        }
    }

    private function seedAboutContent($path)
    {
        $items = $this->getJson($path, 'aboutContent.json');
        foreach ($items as $item) {
            AboutContent::create([
                'section' => $item['section'],
                'title' => $item['title'],
                'content' => $item['content'],
            ]);
        }
    }

    private function seedReports($path)
    {
        $items = $this->getJson($path, 'reports.json');
        foreach ($items as $item) {
            Report::create([
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
                'type' => $item['type'] ?? 'monthly',
                'status' => $item['status'] ?? 'draft',
                'period' => $item['period'] ?? null,
                'file_url' => $item['fileUrl'] ?? null,
            ]);
        }
    }
}
