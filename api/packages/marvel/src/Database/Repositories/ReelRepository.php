<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\Reel;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Enums\Permission;


class ReelRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',

    ];

    protected $dataArray = [
        'name',
        'reel_link',
        'user_id',
        'slug',
    ];


    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
            //
        }
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Reel::class;
    }

    public function storeReel($request)
    {
        $data = $request->only($this->dataArray);
        return $this->create($data);
    }

    public function updateReel($request, $author)
    {
        $author->update($request->only($this->dataArray));
        return $this->findOrFail($author->id);
    }
}
