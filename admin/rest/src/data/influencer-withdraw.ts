import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  WithdrawQueryOptions,
  GetParams,
  WithdrawPaginator,
  Withdraw,
  InfluencerWithdraw,
  InfluencerWithdrawQueryOptions,
  InfluencerWithdrawPaginator
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { influencerWithdrawClient } from './client/influencerWithdraw';

export const useCreateInfluencerWithdrawMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(influencerWithdrawClient.create, {
    onSuccess: () => {
      router.push(`/influencerWithdraw`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INFLUENCER_WITHDRAWS);
    },
  });
};

export const useApproveInfluencerWithdrawMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(influencerWithdrawClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APPROVE_WITHDRAW);
    },
  });
};

export const useInfluencerWithdrawQuery = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery<InfluencerWithdraw, Error>(
    [API_ENDPOINTS.INFLUENCER_WITHDRAWS, { id }],
    () => influencerWithdrawClient.get({ id })
  );

  return {
    withdraw: data,
    error,
    isLoading,
  };
};

export const useInfluencerWithdrawsQuery = (
  params: Partial<InfluencerWithdrawQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<InfluencerWithdrawPaginator, Error>(
    [API_ENDPOINTS.INFLUENCER_WITHDRAWS, params],
    ({ queryKey, pageParam }) =>
      influencerWithdrawClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    withdraws: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
