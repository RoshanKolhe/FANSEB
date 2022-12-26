import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import {
  ProductQueryOptions,
  GetParams,
  ProductPaginator,
  Product,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { influencerProductClient } from './client/influencerProductClient';

export const useCreateInfluencerProductMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  return useMutation(influencerProductClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.influencerProducts
        ? `/${router.query.influencerProducts}${Routes.influencerProduct.list}`
        : Routes.influencerProduct.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INFLUENCER_PRODUCTS);
    },
  });
};

export const useUpdateInfluencerProductMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(influencerProductClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INFLUENCER_PRODUCTS);
    },
  });
};

export const useDeleteInfluencerProductMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(influencerProductClient.deleteInfluencerProduct, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INFLUENCER_PRODUCTS);
    },
  });
};

export const useInfluecnerProductsQuery = (
  params: any,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.INFLUENCER_PRODUCTS, params],
    ({ queryKey, pageParam }) =>
      influencerProductClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    products: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
