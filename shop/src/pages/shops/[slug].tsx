import { Image } from '@/components/ui/image';
import { useWindowSize } from '@/lib/use-window-size';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import ShopSidebar from '@/components/shops/sidebar';
import { productPlaceholder } from '@/lib/placeholders';
import ProductsGrid from '@/components/products/grid';
import { getLayout } from '@/components/layouts/layout';
import { useRouter } from 'next/router';
import { getIcon } from '@/lib/get-icon';
import classNames from 'classnames';
import { NextPageWithLayout } from '@/types';
import * as socialIcons from '@/components/icons/social';
import { InferGetStaticPropsType } from 'next';
import { getStaticPaths, getStaticProps } from '@/framework/shop.ssr';
import Button from '@/components/ui/button';
export { getStaticPaths, getStaticProps };

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);

const ShopPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ shop, variables }) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { t } = useTranslation('banner');

  const isGerman = router.locale === 'de';
  const isBook = router.asPath.includes('/book');

  return (
    <div className="flex flex-col bg-gray-100 lg:flex-row lg:items-start">
      {/* <ShopSidebar shop={shop} className="sticky top-24 lg:top-28" /> */}

      <div className="ltr:lg rtl:lg flex w-full flex-col p-4 lg:p-0">
        <div className="relative h-full w-full overflow-hidden rounded">
          <Image
            objectFit="cover"
            alt={t('heading')}
            src={shop?.cover_image?.original! ?? productPlaceholder}
            layout="responsive"
            width={2340}
            height={870}
            className="h-full w-full"
          />
        </div>
        {/* {shop && ( */}

        <div
          className="align-items-center justify-content-center flex lg:pt-5"
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: '#c77f3c',
            fontSize: '25px',
          }}
        >
          {shop.name}
        </div>
        <div
          className="align-items-center justify-content-center flex lg:pt-3"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '50%',
            textAlign: 'center',
            margin:'auto'
          }}
        >
          {shop.description}
        </div>
        <div
          className="mt-3 flex items-center justify-start"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          {shop?.settings?.socials?.map((item: any, index: number) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              className={`text-muted transition-colors duration-300 focus:outline-none ltr:mr-6 ltr:last:mr-0 rtl:ml-6 rtl:last:ml-0 hover:${item.hoverClass}`}
              rel="noreferrer"
            >
              {getIcon({
                iconList: socialIcons,
                iconName: item.icon,
                className: 'w-8 h-8',
              })}
            </a>
          ))}
        </div>
        <div className="flex flex-col bg-gray-100 lg:flex-row lg:items-start lg:p-8">
          <ProductsGrid
            className="py-8"
            gridClassName={classNames(
              'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3',
              {
                'gap-6 md:gap-8': isBook,
              },
              {
                'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-[repeat(auto-fill,minmax(270px,1fr))]':
                  isGerman,
              }
            )}
            variables={variables}
          />
        </div>
        {/* )} */}
      </div>
      {width > 1023 && <CartCounterButton />}
    </div>
  );
};

ShopPage.getLayout = getLayout;
export default ShopPage;
