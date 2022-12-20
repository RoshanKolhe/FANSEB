import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  Reel,
  ReelPaginator,
  ReelQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { manufacturerClient } from '@/data/client/manufacturer';
import { Config } from '@/config';
import { reelClient } from './client/reels';

export const useCreateReelsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(reelClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.manufacturer.list}`
        : Routes.reels.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REELS);
    },
  });
};

export const useDeleteReelsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(reelClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REELS);
    },
  });
};

export const useUpdateReelsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(reelClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REELS);
    },
  });
};

export const useReelQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Reel, Error>(
    [API_ENDPOINTS.REELS, { slug, language }],
    () => reelClient.get({ slug, language })
  );

  return {
    reel: data,
    error,
    loading: isLoading,
  };
};

export const useReelsQuery = (
  options: Partial<ReelQueryOptions>
) => {
  const { data, error, isLoading } = useQuery<ReelPaginator, Error>(
    [API_ENDPOINTS.REELS, options],
    ({ queryKey, pageParam }) =>
      reelClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    reels: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
