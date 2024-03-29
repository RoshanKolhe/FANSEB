import { NextPageWithLayout, SortOrder } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import Button from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { useTranslation } from 'next-i18next';
import rangeMap from '@/lib/range-map';
import CouponLoader from '@/components/ui/loaders/coupon-loader';
import { useShops } from '@/framework/shop';
import ErrorMessage from '@/components/ui/error-message';
import ShopCard from '@/components/ui/cards/shop';
import { SHOPS_LIMIT } from '@/lib/constants';
import InfluencerCard from '@/components/ui/cards/influencer';
import { useUsersQuery } from '@/framework/influencer';
import { useState } from 'react';
export { getStaticProps } from '@/framework/shops-page.ssr';

const InfluencersPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const limit = SHOPS_LIMIT;
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { influencers, isLoading, isLoadingMore, hasMore, loadMore, error } =
    useUsersQuery({
      limit: 20,
      name: searchTerm,
      orderBy,
      sortedBy,
    });
  if (error) return <ErrorMessage message={error.message} />;
  if (!isLoading && !influencers.length) {
    return (
      <div className="min-h-full bg-gray-100 px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-no-shops" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-light " style={{ marginBottom: '50px' }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col p-8 pt-14">
          <h3 className="mb-8 text-2xl font-bold text-heading">
            All Influencers
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading && !influencers.length ? (
              <>
                {rangeMap(limit, (i) => (
                  <CouponLoader key={i} uniqueKey={`shops-${i}`} />
                ))}
              </>
            ) : (
              influencers.map((influencer: any) => (
                <InfluencerCard influencer={influencer} key={influencer.id} />
              ))
            )}
          </div>
          {hasMore && (
            <div className="mt-8 flex items-center justify-center lg:mt-12">
              <Button onClick={loadMore} loading={isLoadingMore}>
                {t('text-load-more')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <footer
        style={{ display: 'flex', justifyContent: 'center' }}
        className="fixed bottom-0 z-10 w-full bg-light py-5 px-6"
      >
        <p style={{ fontWeight: 600 }}>Saptco Bhartiya Private Ltd.</p>
      </footer>
    </>
  );
};
InfluencersPage.getLayout = getLayout;

export default InfluencersPage;
