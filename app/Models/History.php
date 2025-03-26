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

    protected $fillable = ['game_id', 'user_id', 'fen', 'turn'];

    /** BONUS
     * Implement belongs-to relation with User
     */
    public function player() {}
}
