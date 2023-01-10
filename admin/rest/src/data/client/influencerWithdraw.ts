import {
  Withdraw,
  WithdrawPaginator,
  WithdrawQueryOptions,
  CreateWithdrawInput,
  QueryOptions,
  ApproveWithdrawInput,
  InfluencerWithdraw,
  CreateInfluencerWithdrawInput,
  InfluencerWithdrawPaginator,
  InfluencerWithdrawQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const influencerWithdrawClient = {
  ...crudFactory<InfluencerWithdraw, QueryOptions, CreateInfluencerWithdrawInput>(
    API_ENDPOINTS.INFLUENCER_WITHDRAWS
  ),
  get({ id }: { id: string }) {
    return HttpClient.get<InfluencerWithdraw>(`${API_ENDPOINTS.INFLUENCER_WITHDRAWS}/${id}`);
  },
  paginated: ({ influencer_id, ...params }: Partial<InfluencerWithdrawQueryOptions>) => {
    return HttpClient.get<InfluencerWithdrawPaginator>(API_ENDPOINTS.INFLUENCER_WITHDRAWS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ influencer_id }),
    });
  },
  approve(data: ApproveWithdrawInput) {
    return HttpClient.post<InfluencerWithdraw>(API_ENDPOINTS.APPROVE_INFLUENCER_WITHDRAW, data);
  },
};
