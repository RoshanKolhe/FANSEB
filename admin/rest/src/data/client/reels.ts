import { crudFactory } from '@/data/client/curd-factory';
import {
    CreateManufacturerInput,
    CreateReelInput,
    ManufacturerPaginator,
    ManufacturerQueryOptions,
    QueryOptions,
    Reel,
    ReelPaginator,
    ReelQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const reelClient = {
    ...crudFactory<Reel, QueryOptions, CreateReelInput>(
        API_ENDPOINTS.REELS
    ),
    paginated: ({
        name,
        ...params
    }: Partial<ReelQueryOptions>) => {
        return HttpClient.get<ReelPaginator>(API_ENDPOINTS.REELS, {
            searchJoin: 'and',
            ...params,
            search: HttpClient.formatSearchParams({ name }),
        });
    },
};
