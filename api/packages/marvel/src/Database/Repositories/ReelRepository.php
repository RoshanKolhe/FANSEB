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
        'videoDuration',
        'reel_link',
        'thumbnail',
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
        $reel = $this->create($data);
        if($request->products){
            $reel->products()->sync($request->products);
        }
        return $reel;
    }

    public function updateReel($request, $reel)
    {
        $reel->update($request->only($this->dataArray));
        if($request->products){
            $reel->products()->sync($request->products);    
        }
        return $this->findOrFail($reel->id);
    }
}
