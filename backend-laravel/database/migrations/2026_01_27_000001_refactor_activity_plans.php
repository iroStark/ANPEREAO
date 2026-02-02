<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create activity_plans table
        Schema::create('activity_plans', function (Blueprint $table) {
            $table->id();
            $table->string('year'); // e.g. "2025"
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Modify activity_plan_items table
        // Since we are changing structure drastically, it's safer to drop and recreate 
        // if we assume no production data, or alter if we want to be safe. 
        // Given the mismatch, existing data is likely invalid for the new structure anyway.
        // We will drop and recreate for cleaner schema.

        Schema::dropIfExists('activity_plan_items');

        Schema::create('activity_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_plan_id')->constrained('activity_plans')->onDelete('cascade');
            $table->integer('number'); // Item number e.g. 1, 2, 3
            $table->string('activity'); // The activity name/description
            $table->string('date')->nullable();
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->string('participants')->nullable();
            $table->integer('order_index')->default(0);
            $table->string('parent_id')->nullable(); // For hierarchical items if needed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_plan_items');
        Schema::dropIfExists('activity_plans');

        // Restore original table if needed (simplified version)
        Schema::create('activity_plan_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('term')->nullable();
            $table->string('year')->nullable();
            $table->string('status')->default('planned');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });
    }
};
