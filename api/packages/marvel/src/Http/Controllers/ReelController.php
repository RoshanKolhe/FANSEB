<?php

namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Reel;
use Marvel\Database\Repositories\ReelRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ReelRequest;

class ReelController extends CoreController
{
    public $repository;

    public function __construct(ReelRepository $repository)
    {
        $this->repository = $repository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Reel[]
     */
    public function index(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $limit = $request->limit ?   $request->limit : 15;
        $user_id = $request->user_id;
        return $this->repository->where('language', $language)->where('user_id',$user_id)->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ReelRequest $request
     * @return mixed
     */
    public function store(ReelRequest $request)
    {
        $request['user_id'] = $request->user()->id;
        return $this->repository->storeReel($request);

    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function show(Request $request, $slug)
    {
        $request->slug = $slug;
        return $this->fetchReel($request);
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function fetchReel(Request $request)
    {
        try {
            $slug = $request->slug;
            $language = $request->language ?? DEFAULT_LANGUAGE;
            if (is_numeric($slug)) {
                $slug = (int) $slug;
                return $this->repository->where('id', $slug)->firstOrFail();
            }
            return $this->repository->where('slug', $slug)->where('language', $language)->firstOrFail();
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ManufacturerRequest $request
     * @param int $id
     * @return array
     */
    public function update(ReelRequest $request, $id)
    {
        $request->id = $id;
        return $this->updateReel($request);
    }

    public function updateReel(Request $request)
    {
            try {
                $Reel = $this->repository->findOrFail($request->id);
            } catch (\Exception $e) {
                throw new MarvelException(NOT_FOUND);
            }
            return $this->repository->updateReel($request, $Reel);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    public function topManufacturer(Request $request)
    {
        $limit = $request->limit ? $request->limit : 10;
        $language = $request->language ?? DEFAULT_LANGUAGE;
        return $this->repository->where('language', $language)->withCount('products')->orderBy('products_count', 'desc')->take($limit)->get();
    }
}
