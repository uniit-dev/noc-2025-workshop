<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class History extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'history';

    protected $fillable = ['game_id', 'user_id', 'fen', 'order'];

    public function player(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
