
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_voters', function (Blueprint $table) {
            $table->id();

            $table->foreignId('campaign_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('voter_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamp('voted_at')->useCurrent();

            // O mesmo eleitor só pode votar uma vez por campanha.
            $table->unique(['campaign_id', 'voter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_voters');
    }
};
