<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\InfluencerWithdraw;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class InfluencerWithdrawRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'influencer_id',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return InfluencerWithdraw::class;
    }
}
