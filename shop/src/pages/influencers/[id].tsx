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
import useResizeObserver from 'use-resize-observer';

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
  const { t } = useTranslation('banner');
  const {
    ref,
    width: windoWidth = 1,
    height = 1,
  } = useResizeObserver<HTMLDivElement>();

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
  const influencerSliderImages = influencer?.profile?.influencerPageImages
    ? influencer?.profile?.influencerPageImages.map((res: any) => {
        return res.original;
      })
    : [];
  return (
    <>
      <div
        className="flex flex-col bg-gray-100 lg:flex-row lg:items-start"
        ref={ref}
      >
        {/* <ShopSidebar shop={shop} className="sticky top-24 lg:top-28" /> */}

        <div className="ltr:lg rtl:lg flex w-full flex-col lg:p-0">
          <div className="relative h-full w-full overflow-hidden rounded">
            {influencerSliderImages && influencerSliderImages.length > 0 ? (
              <SimpleImageSlider
                width={windoWidth}
                height="70vh"
                images={influencerSliderImages}
                showBullets={true}
                autoPlay={true}
                showNavs={true}
              />
            ) : (
              <Image
                objectFit="cover"
                alt={t('heading')}
                src={productPlaceholder}
                layout="responsive"
                width={windoWidth}
                height={height / 2.5}
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
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '50%',
                  textAlign: 'center',
                  margin: 'auto',
                }}
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
                          'grid  grid-cols-[repeat(auto-fill,minmax(110px,1fr))] h-[22rem]  md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] md:h-[32rem] sm:h-[16rem] lg:h-[32rem] gap-3',
                          {
                            'gap-6 md:gap-8': isBook,
                          },
                          {
                            'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]':
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
      <footer
        style={{ display: 'flex', justifyContent: 'center' }}
        className="fixed bottom-0 z-10 w-full bg-light py-5 px-6"
      >
        <p style={{ fontWeight: 600 }}>Saptco Bhartiya Private Ltd.</p>
      </footer>
    </>
  );
};

InfluencerPage.getLayout = getLayout;

export default InfluencerPage;
