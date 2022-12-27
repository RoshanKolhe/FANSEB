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
import { getStaticPaths, getStaticProps } from '@/framework/influencer.ssr';
import Button from '@/components/ui/button';
import { getInfluencerUser } from '@/framework/user';
import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
export { getStaticPaths, getStaticProps };

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);

const InfluencerPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ id, variables }) => {
  const {
    influencer,
    isLoading,
    error,
  }: { influencer: any; isLoading: any; error: any } = getInfluencerUser({
    user_id: id,
  });
  console.log('influecner', influencer);
  const { t } = useTranslation('banner');
  const router = useRouter();
  const { width } = useWindowSize();
  const styles = {
    text_color_normal: {
      color: '#000',
    },
    text_color_selcted: {
      color: '#D8A778',
      textDecoration: 'underline 10px',
    },
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isGerman = router.locale === 'de';
  const isBook = router.asPath.includes('/book');
  const influencerSliderImages = influencer?.profile?.influencerPageImages.map(
    (res: any) => {
      return res.original;
    }
  );
  console.log('influencerSliderImages', influencerSliderImages);
  return (
    <div className="flex flex-col bg-gray-100 lg:flex-row lg:items-start">
      {/* <ShopSidebar shop={shop} className="sticky top-24 lg:top-28" /> */}

      <div className="ltr:lg rtl:lg flex w-full flex-col p-4 lg:p-0">
        <div className="relative h-full w-full overflow-hidden rounded">
          {influencerSliderImages ? (
            <SimpleImageSlider
              width={1519}
              height={564}
              images={influencerSliderImages}
              showBullets={false}
              autoPlay
              showNavs={true}
            />
          ) : (
            <Image
              objectFit="cover"
              alt={t('heading')}
              src={productPlaceholder}
              layout="responsive"
              width={2340}
              height={870}
              className="h-full w-full"
            />
          )}
        </div>
        {influencer && (
          <>
            <div
              className="align-items-center justify-content-center flex lg:pt-5"
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#c77f3c',
                fontSize: '25px',
              }}
            >
              {influencer.name}
            </div>
            <div
              className="align-items-center justify-content-center flex lg:pt-3"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {influencer?.profile?.bio}
            </div>
            <div
              className="mt-3 flex items-center justify-start"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {influencer?.profile?.socials?.socials.map(
                (item: any, index: number) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    className={`text-muted transition-colors duration-300 focus:outline-none ltr:mr-6 ltr:last:mr-0 rtl:ml-6 rtl:last:ml-0 hover:${item.hoverClass}`}
                    rel="noreferrer"
                  >
                    {getIcon({
                      iconList: socialIcons,
                      iconName: item.type,
                      className: 'w-8 h-8',
                    })}
                  </a>
                )
              )}
            </div>
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <div
                className="align-items-center justify-content-center flex lg:pt-3"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'black',
                  fontSize: '25px',
                }}
              >
                <Tab.List>
                  <Tab
                    style={
                      selectedIndex === 0
                        ? styles.text_color_selcted
                        : styles.text_color_normal
                    }
                  >
                    <div className="pr-3">Collection</div>
                  </Tab>

                  <Tab
                    style={
                      selectedIndex === 1
                        ? styles.text_color_selcted
                        : styles.text_color_normal
                    }
                  >
                    <div className="pr-3">Products</div>
                  </Tab>
                  <Tab
                    style={
                      selectedIndex === 2
                        ? styles.text_color_selcted
                        : styles.text_color_normal
                    }
                  >
                    <div className="pr-3">Reels</div>
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels>
                <Tab.Panel>
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
                      isInfluencerGrid={true}
                      isCollection={true}
                      variables={variables}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
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
                      isInfluencerGrid={true}
                      variables={variables}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="flex flex-col bg-gray-100 lg:flex-row lg:items-start lg:p-8">
                    <ProductsGrid
                      className="py-8"
                      gridClassName={classNames(
                        'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3',
                        {
                          'gap-6 md:gap-8': isBook,
                        },
                        {
                          'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]':
                            isGerman,
                        }
                      )}
                      isReelGrid={true}
                      variables={variables}
                    />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {/* <div className="flex flex-col bg-gray-100 lg:flex-row lg:items-start lg:p-8">
              <ProductsGrid
                className="py-8"
                gridClassName={classNames(
                  'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3',
                  {
                    'gap-6 md:gap-8': isBook,
                  },
                  {
                    'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-[repeat(auto-fill,minmax(270px,1fr))]': isGerman,
                  }
                )}
                isInfluencerGrid={true}
                variables={variables} />
            </div> */}
          </>
        )}
      </div>
      {width > 1023 && <CartCounterButton />}
    </div>
  );
};

InfluencerPage.getLayout = getLayout;

export default InfluencerPage;
