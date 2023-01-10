<?php


namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\InfluencerBalance;
use Marvel\Database\Models\Withdraw;
use Marvel\Database\Repositories\InfluencerWithdrawRepository;
use Marvel\Enums\Permission;
use Marvel\Enums\WithdrawStatus;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\UpdateInfluencerWithdrawRequest;
use Marvel\Http\Requests\InfluencerWithdrawRequest;
use Prettus\Validator\Exceptions\ValidatorException;


class InfluencerWithdrawController extends CoreController
{
    public $repository;

    public function __construct(InfluencerWithdrawRepository $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Withdraw[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $withdraw = $this->fetchWithdraws($request);
        return $withdraw->paginate($limit);
    }

    public function fetchWithdraws(Request $request)
    {
        $user = $request->user();
        if ($user) {
            if ($user->hasPermissionTo(Permission::INFLUENCER)) {
                return $this->repository->with(['user'])->where('influencer_id', '=', $user->id);
            } else if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return $this->repository->with(['user'])->where('id', '!=', NULL);
            } else {
                throw new MarvelException(NOT_AUTHORIZED);
            }
        } else {
            throw new MarvelException(NOT_AUTHORIZED);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param InfluencerWithdrawRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(InfluencerWithdrawRequest $request)
    {
        $validatedData = $request->validated();
        if (isset($validatedData['influencer_id'])) {
            $influencerBalance = InfluencerBalance::where('influencer_id', '=', $validatedData['influencer_id'])->first();
            if (isset($influencerBalance->current_balance) && $influencerBalance->current_balance >= $validatedData['amount']) {
                $withdraw = $this->repository->create($validatedData);
                $influencerBalance->withdrawn_amount = $influencerBalance->withdrawn_amount + $validatedData['amount'];
                $influencerBalance->current_balance = $influencerBalance->current_balance - $validatedData['amount'];
                $influencerBalance->save();
                $withdraw->status = WithdrawStatus::PENDING;
                return $withdraw;
            } else {
                throw new MarvelException(INSUFFICIENT_BALANCE);
            }
        } else {
            throw new MarvelException(WITHDRAW_MUST_BE_ATTACHED_TO_SHOP);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, $id)
    {
        $request->id = $id;
        return $this->fetchSingleWithdraw($request);
    }

    public function fetchSingleWithdraw(Request $request)
    {
        $id = $request->id;
        try {
            $withdraw = $this->repository->with(['user'])->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }
        if ($request->user() && ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN))) {
            return $withdraw;
        } else {
            throw new MarvelException(NOT_AUTHORIZED);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateInfluencerWithdrawRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateInfluencerWithdrawRequest $request, $id)
    {
        throw new MarvelException(ACTION_NOT_VALID);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        if ($request->user() && $request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
            try {
                return $this->repository->findOrFail($id)->delete();
            } catch (\Exception $e) {
                throw new MarvelException(NOT_FOUND);
            }
        } else {
            throw new MarvelException(NOT_AUTHORIZED);
        }
    }

    public function approveWithdraw(Request $request)
    {
        $id = $request->id;
        $status = $request->status->value ?? $request->status;
        try {
            $withdraw = $this->repository->findOrFail($id);
        } catch (Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }

        $withdraw->status = $status;

        $withdraw->save();

        return $withdraw;
    }
}