import Card from '@/components/common/card';
import InfluencerLayout from '@/components/layouts/influencer';
import Search from '@/components/common/search';
import ReelsList from '@/components/reels/reels-list';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';

import { LIMIT } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminAndInfluencerOnly, adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { GetStaticProps } from 'next';
import { SortOrder } from '@/types';
import { useManufacturersQuery } from '@/data/manufacturer';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { useReelsQuery } from '@/data/reels';
import { useMeQuery } from '@/data/user';

export default function Reels() {
  const userData = useMeQuery();
  const { permissions: currentUserPermissions } = getAuthCredentials();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { reels, paginatorInfo, loading, error } =
    useReelsQuery({
      limit: LIMIT,
      name: searchTerm,
      page,
      orderBy,
      user_id: userData.data?.id,
      sortedBy,
      language: locale,
      
    });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/3 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            Reels
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-2/3">
          <Search onSearch={handleSearch} />
          {currentUserPermissions?.includes('influencer') &&
            locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.reels.create}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span>
                  + Add Reel
                </span>
              </LinkButton>
            )}
        </div>
      </Card>

      <ReelsList
        reels={reels}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
Reels.authenticate = {
  permissions: adminAndInfluencerOnly,
};
Reels.Layout = InfluencerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
  },
});
