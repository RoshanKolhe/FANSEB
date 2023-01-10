<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfluencerBalance extends Model
{
    protected $table = 'influencerbalances';

    public $guarded = [];

    protected $casts = [
        'payment_info' => 'json',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'influencer_id');
    }
}
