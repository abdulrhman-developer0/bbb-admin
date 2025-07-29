<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bbb_hooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('callback_url');
            $table->string('meeting_id')->nullable();
            $table->string('hook_id')->nullable(); // The ID returned by BBB when registering the hook
            $table->string('event_type'); // e.g., 'meeting-created', 'user-joined', 'meeting-ended', etc.
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable(); // Store any additional data
            $table->timestamp('last_called_at')->nullable();
            $table->integer('call_count')->default(0);
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'meeting_id']);
            $table->index(['hook_id']);
            $table->index(['event_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bbb_hooks');
    }
};