import { QueryOptionsType, UserPaginator } from "@/types";
import type { ShopPaginator, ShopQueryOptions } from '@/types';
import { useInfiniteQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';

export const useUsersQuery = (options: Partial<QueryOptionsType>) => {
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
      } = useInfiniteQuery<UserPaginator, Error>(
        [API_ENDPOINTS.INFLUENCERS, {...options,permission:'influencer'}],
        ({ queryKey, pageParam }) =>
          client.influencers.all(Object.assign({}, queryKey[1], pageParam)),
        {
          getNextPageParam: ({ current_page, last_page }) =>
            last_page > current_page && { page: current_page + 1 },
        }
      );
    
      function handleLoadMore() {
        fetchNextPage();
      }
    
      return {
        influencers: data?.pages?.flatMap((page) => page.data) ?? [],
        paginatorInfo: Array.isArray(data?.pages)
          ? mapPaginatorData(data?.pages[data.pages.length - 1])
          : null,
        isLoading,
        error,
        isFetching,
        isLoadingMore: isFetchingNextPage,
        loadMore: handleLoadMore,
        hasMore: Boolean(hasNextPage),
      };
  };