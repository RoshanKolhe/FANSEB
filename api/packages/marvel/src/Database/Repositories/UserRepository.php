<?php

namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Marvel\Database\Models\User;
use Prettus\Validator\Exceptions\ValidatorException;
use Spatie\Permission\Models\Permission;
use Marvel\Enums\Permission as UserPermission;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Mail\ForgetPassword;
use Illuminate\Support\Facades\Mail;
use Marvel\Database\Models\Address;
use Marvel\Database\Models\Profile;
use Marvel\Database\Models\Shop;
use Marvel\Exceptions\MarvelException;

class UserRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name' => 'like',
        'email' => 'like',
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'name',
        'email',
        'shop_id'
    ];

    /**
     * Configure the Model
     **/
    public function model()
    {
        return User::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    public function fetchRelated($request, $limit = 20, $language = DEFAULT_LANGUAGE)
    {
        try {

            $user = $this->findOneByFieldOrFail('id', $request->userId);
            if ($request->orderByColumn && $request->sortedByColumn) {
                $products = $user->products()->with('shop')->where('name', 'LIKE', "%{$request->name}%")->orderBy($request->orderByColumn, $request->sortedByColumn)->paginate($limit);
            } else {
                $products = $user->products()->where('name', 'LIKE', "%{$request->name}%")->with('shop')->paginate($limit);

            }
            if (sizeOf($products) > 0) {
                return $products;
            }
            return [
                'data' => []
            ];
        } catch (Exception $e) {
            return [];
        }
    }
    public function fetchSingle($request, $language = DEFAULT_LANGUAGE)
    {
        $slug = $request->slug;
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $user = $this->findOneByFieldOrFail('id', $request->userId);

        try {
            if (is_numeric($slug)) {
                $slug = (int) $slug;
                $product = $user->products()->where('id', $slug)->with('shop')->firstOrFail();
                ;
            }

            $product = $user->products()->where('language', $language)->where('slug', $slug)
                ->with(['type', 'shop', 'categories', 'tags', 'variations.attribute.values', 'variation_options', 'author', 'manufacturer'])
                ->firstOrFail();
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }

        return $product;
    }


    public function storeUser($request)
    {
        try {
            $user = $this->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $user->givePermissionTo(UserPermission::CUSTOMER);
            if (isset($request['address']) && count($request['address'])) {
                $user->address()->createMany($request['address']);
            }
            if (isset($request['profile'])) {
                $user->profile()->create($request['profile']);
            }
            $user->profile = $user->profile;
            $user->address = $user->address;
            $user->shop = $user->shop;
            $user->managed_shop = $user->managed_shop;
            return $user;
        } catch (ValidatorException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    public function updateUser($request, $user)
    {
        try {
            if (isset($request['address']) && count($request['address'])) {
                foreach ($request['address'] as $address) {
                    if (isset($address['id'])) {
                        Address::findOrFail($address['id'])->update($address);
                    } else {
                        $address['customer_id'] = $user->id;
                        Address::create($address);
                    }
                }
            }
            if (isset($request['profile'])) {
                if (isset($request['profile']['id'])) {
                    Profile::findOrFail($request['profile']['id'])->update($request['profile']);
                    if (isset($request['influencer_balance'])) {
                        $influencerBalance = $request['influencer_balance'] + [
                            'influencer_commission_rate' => '10',
                        ];
                        $user->influencerBalance()->updateOrCreate(['influencer_id' => $user->id], $influencerBalance);
                    }
                } else {
                    $profile = $request['profile'];
                    $profile['customer_id'] = $user->id;
                    Profile::create($profile);
                }
            }
            $user->update($request->only($this->dataArray));
            $user->profile = $user->profile;
            $user->address = $user->address;
            $user->shop = $user->shop;
            $user->influencer_balance = $request['influencer_balance'];
            $user->managed_shop = $user->managed_shop;
            return $user;
        } catch (ValidationException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    public function sendResetEmail($email, $token)
    {
        try {
            Mail::to($email)->send(new ForgetPassword($token));
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}