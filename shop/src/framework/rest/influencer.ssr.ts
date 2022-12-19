import type { ProductQueryOptions, Shop } from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { PRODUCTS_PER_PAGE } from './client/variables';
import { SettingsQueryOptions } from '@/types';
import { Id } from 'react-toastify';

// This function gets called at build time
type ParsedQueryParams = {
    id: string;
};
export const getStaticPaths:  GetStaticPaths<ParsedQueryParams>  = async ({
    locales,
}) => {
    invariant(locales, 'locales is not defined');
    const { data } = await client.influencers.all({ limit: 100 });
    const paths = data?.flatMap((influencer) =>
        locales?.map((locale: any) => ({ params: { id: influencer.id.toString() }, locale }))
    );
    return {
        paths,
        fallback: 'blocking',
    };
};
type PageProps = {
    id: string;
    variables: {
        id: string;
        limit: number;
    };
};
export const getStaticProps: GetStaticProps<
PageProps,
ParsedQueryParams
> = async ({ params, locale }) => {
    const { id } = params!; //* we know it's required because of getStaticPaths
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(
        [API_ENDPOINTS.SETTINGS, { language: locale }],
        ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
    );
    try {
        await queryClient.prefetchInfiniteQuery(
            [API_ENDPOINTS.INFLUENCER_PRODUCTS, { limit: PRODUCTS_PER_PAGE, userId: id, language: locale }],
            ({ queryKey }) => client.products.influencerProduct(queryKey[1])
        );
        return {
            props: {
                id:id,
                variables: {
                    id: id,
                    limit: PRODUCTS_PER_PAGE,
                },
                ...(await serverSideTranslations(locale!, ['common'])),
                dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
            },
            revalidate: 60,
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};
