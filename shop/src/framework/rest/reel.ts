import type {
  PopularProductQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  GetParams,
  ReelQueryOptions,
  ReelPaginator,
  Reel,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { formatProductsArgs } from '@/framework/utils/format-products-args';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export function useReels(options?: Partial<ReelQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...formatProductsArgs(options),
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ReelPaginator, Error>(
    [API_ENDPOINTS.REELS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.reels.influencerReelsPaginated(
        Object.assign({}, queryKey[1], pageParam)
      ),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    products: data?.pages?.flatMap((page) => page.data) ?? [],
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
}

export const useInfluecnerProductsQuery = (params: any) => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<any, Error>(
    [API_ENDPOINTS.INFLUENCER_PRODUCTS, params],
    ({ queryKey, pageParam }) =>
      client.products.influencerProductsPaginated(
        Object.assign({}, queryKey[1], pageParam)
      ),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    products: data?.pages?.flatMap((page) => page.data) ?? [],
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

export const usePopularProducts = (
  options?: Partial<PopularProductQueryOptions>
) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const { data, isLoading, error } = useQuery<Product[], Error>(
    [API_ENDPOINTS.PRODUCTS_POPULAR, formattedOptions],
    ({ queryKey }) =>
      client.products.popular(queryKey[1] as PopularProductQueryOptions)
  );

  return {
    products: data ?? [],
    isLoading,
    error,
  };
};

export function useReel({ id }: { id: string }) {
  const { locale: language } = useRouter();

  const { data, isLoading, error } = useQuery<Reel, Error>(
    [API_ENDPOINTS.REELS, { language }],
    () => client.reels.get({ slug:id, language })
  );
  return {
    reel: data,
    isLoading,
    error,
  };
}
