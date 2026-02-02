<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Update Users Table (add generic fields)
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->nullable();
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });

        // 2. Galleries
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['image', 'video'])->default('image');
            $table->string('date')->nullable(); // Display date string e.g. "Junho 2023"
            $table->string('category')->default('Geral');
            $table->integer('views')->default(0);
            $table->string('duration')->nullable();
            $table->string('thumbnail')->nullable(); // JSON uses 'thumbnail'
            $table->string('media_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // 3. Events
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('date')->nullable(); // Display date string
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->string('type')->nullable();
            $table->string('capacity')->nullable();
            $table->string('registration_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // 4. Legislations
        Schema::create('legislations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('year')->nullable();
            $table->string('icon')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // 5. Publications (Reports/Documents)
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('date')->nullable();
            $table->string('file_url')->nullable();
            $table->string('download_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // 6. About Contents
        Schema::create('about_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section')->index(); // mission, vision, etc
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });

        // 7. Contact Messages
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status')->default('unread');
            $table->timestamp('date')->useCurrent();
            $table->timestamps();
        });

        // 8. Social Organs
        Schema::create('social_orgaos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->string('organ_type')->nullable(); // mesa, conselho_fiscal, etc.
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->integer('order_index')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // 9. Activity Plan Items
        Schema::create('activity_plan_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('term')->nullable(); // Q1, Q2, etc.
            $table->string('year')->nullable();
            $table->string('status')->default('planned');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 10. Members
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('member_number')->nullable();
            $table->string('full_name');
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('nationality')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('id_document')->nullable();
            $table->date('id_issue_date')->nullable();
            $table->string('id_issue_place')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('occupation')->nullable();
            $table->string('phone')->nullable();
            $table->text('current_address')->nullable();
            $table->string('municipality')->nullable();
            $table->string('work_province')->nullable();
            $table->string('email')->nullable();
            $table->string('photo_url')->nullable();
            $table->text('other_info')->nullable();
            $table->date('registration_date')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // 11. Notifications (Custom table, not polymorphic default)
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->boolean('read')->default(false);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 12. Reports (Admin Reports - distinct from publications if needed, or mapped. Assuming separate for now base on hooks)
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type'); // monthly, annual
            $table->string('status')->default('draft');
            $table->string('period')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamps();
        });

        // 13. Slideshow
        Schema::create('slideshows', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('image_url');
            $table->string('link')->nullable();
            $table->integer('order_index')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slideshows');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('members');
        Schema::dropIfExists('activity_plan_items');
        Schema::dropIfExists('social_orgaos');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('about_contents');
        Schema::dropIfExists('publications');
        Schema::dropIfExists('legislations');
        Schema::dropIfExists('events');
        Schema::dropIfExists('galleries');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'role', 'is_active', 'last_login_at']);
        });
    }
};
