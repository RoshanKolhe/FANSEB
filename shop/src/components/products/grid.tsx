import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductLoader from '@/components/ui/loaders/product-loader';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import ProductCard from '@/components/products/cards/card';
import ErrorMessage from '@/components/ui/error-message';
import { useInfluecnerProductsQuery, useProducts } from '@/framework/product';
import { PRODUCTS_PER_PAGE } from '@/framework/client/variables';
import type { Product } from '@/types';
import ReelCard from './cards/reel-card';
import { useReels } from '@/framework/reel';

interface Props {
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  column?: 'five' | 'auto';
  shopId?: string;
  gridClassName?: string;
  products: Product[] | undefined;
  isLoading?: boolean;
  error?: any;
  loadMore?: any;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  isReelGrid?: any;
  className?: string;
}

export function Grid({
  className,
  gridClassName,
  products,
  isLoading,
  error,
  loadMore,
  isLoadingMore,
  hasMore,
  limit = PRODUCTS_PER_PAGE,
  column = 'auto',
  isReelGrid = 'false'
}: Props) {

  const { t } = useTranslation('common');

  if (error) return <ErrorMessage message={error.message} />;

  if (!isLoading && !products?.length) {
    return (
      <div className="min-h-full w-full px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {isReelGrid ? <div
        className={cn(
          {
            'grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3':
              column === 'auto',
            'grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-11 2xl:grid-cols-5 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]':
              column === 'five',
          },
          gridClassName
        )}
        style={{padding:'20px'}}
      >
        {isLoading && !products?.length
          ? rangeMap(limit, (i) => (
            <ProductLoader key={i} uniqueKey={`product-${i}`} />
          ))
          : products?.map((product) => (
            <ReelCard reel={product} key={product.id} />
          ))}


      </div> : <div
        className={cn(
          {
            'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3':
              column === 'auto',
            'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-11 2xl:grid-cols-5 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]':
              column === 'five',
          },
          gridClassName
        )}
      >
        {isLoading && !products?.length
          ? rangeMap(limit, (i) => (
            <ProductLoader key={i} uniqueKey={`product-${i}`} />
          ))
          : products?.map((product:any) => (
            <ProductCard product={product} key={product?.id} isNotInfluencerProduct={product?.pivot?.featureInfluencerImageUrl === "" ? true :false}/>
          ))}
      </div>}

      {hasMore && (
        <div className="mt-8 flex justify-center lg:mt-12">
          <Button
            loading={isLoadingMore}
            onClick={loadMore}
            className="h-11 text-sm font-semibold md:text-base"
          >
            {t('text-load-more')}
          </Button>
        </div>
      )}
    </div>
  );
}
interface ProductsGridProps {
  className?: string;
  gridClassName?: string;
  variables?: any;
  column?: 'five' | 'auto';
  isInfluencerGrid?: boolean;
  isCollection?: any;
  isReelGrid?: any;
}
export default function ProductsGrid({
  className,
  gridClassName,
  variables,
  column = 'auto',
  isInfluencerGrid = false,
  isCollection = false,
  isReelGrid = false
}: ProductsGridProps) {

  const { products, loadMore, isLoadingMore, isLoading, hasMore, error } =
    isInfluencerGrid ? useInfluecnerProductsQuery({ userId: variables?.id }) : isReelGrid ? useReels({ user_id: variables?.id }) : useProducts(variables);


  const productsItem: any = products;

  const collectionItems = products.filter((res) => {
    return res?.pivot?.featureInfluencerImageUrl;
  });

  const productItems = products.filter((res) => {
    return !res?.pivot?.featureInfluencerImageUrl;
  });

  const finalProductsItem = isCollection && collectionItems ? collectionItems.map((res) => {
    return { ...res, image: JSON.parse(res.pivot.featureInfluencerImageUrl), gallery: [JSON.parse(res.pivot.featureInfluencerImageUrl), ...res.gallery] };
  }) : productItems;

  const finalReelItem = isReelGrid && productsItem

  return (
    <Grid
      products={isInfluencerGrid ? finalProductsItem : isReelGrid ? finalReelItem : productsItem}
      loadMore={loadMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error}
      className={className}
      gridClassName={gridClassName}
      column={column}
      isReelGrid={isReelGrid}
    />
  );
}
