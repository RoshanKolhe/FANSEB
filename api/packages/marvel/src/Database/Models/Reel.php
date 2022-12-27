<?php

namespace Marvel\Database\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Marvel\Traits\Translation;

class Reel extends Model
{
    use Sluggable;
    use Translation;


    protected $table = 'reels';

    public $guarded = [];

    public $appends = ['translated_languages'];

    protected $casts = [
        'reel_link' => 'json',
        'thumbnail' => 'json',
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    public function scopeWithUniqueSlugConstraints(Builder $query, Model $model): Builder
    {
        return $query->where('language', $model->language);
    }

    /**
     * @return BelongsTo
     */
    public function user(){
        return $this->belongsTo(User::class);
    }
}
