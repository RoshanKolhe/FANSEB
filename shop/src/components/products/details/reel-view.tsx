import BackButton from '@/components/ui/back-button';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import usePrice from '@/lib/use-price';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';
import { useTranslation } from 'next-i18next';
import { getVariations } from '@/lib/get-variations';
import { useEffect, useMemo, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Truncate from '@/components/ui/truncate';
import { scroller, Element } from 'react-scroll';
import CategoryBadges from './category-badges';
import VariationPrice from './variation-price';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import type { Product, Reel } from '@/types';
import { useAtom } from 'jotai';
import VariationGroups from './variation-groups';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAttributes } from './attributes.context';
import classNames from 'classnames';
import { displayImage } from '@/lib/display-product-preview-images';
import { HeartOutlineIcon } from '@/components/icons/heart-outline';
import { HeartFillIcon } from '@/components/icons/heart-fill';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUser } from '@/framework/user';
import { useInWishlist, useToggleWishlist } from '@/framework/wishlist';
import { useIntersection } from 'react-use';
import { StarIcon } from '@/components/icons/star-icon';
import dynamic from 'next/dynamic';

type Props = {
  reel: Reel;
  backBtn?: boolean;
  isModal?: boolean;
  aspectRatio?: string;
  related_products?: any;
};
const ReelView: React.FC<Props> = ({
  reel,
  aspectRatio = 'square',
  backBtn = true,
  isModal = false,
  related_products,
}) => {
  const {
    id,
    reel_link,
    name,
    videoDuration, //could only had image we need to think it also
    thumbnail,
  } = reel ?? {};
  const { t } = useTranslation('common');
  const RelatedProducts = dynamic(() => import('./related-products'));
  const router = useRouter();
  const { closeModal } = useModalAction();
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });
  const videoEl = useRef(null);
  const { attributes } = useAttributes();

  const navigate = (path: string) => {
    router.push(path);
    closeModal();
  };

  const scrollDetails = () => {
    scroller.scrollTo('details', {
      smooth: true,
      offset: -80,
    });
  };

  return (
    <article className="rounded-lg bg-light">
      <div className="flex flex-col border-b border-border-200 border-opacity-70 md:flex-row">
        <div className="p-6 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="mb-8 flex items-center justify-between lg:mb-10">
            {backBtn && <BackButton />}
          </div>

          <div
            className="product-gallery h-full"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {videoDuration ? (
              <video
                playsInline
                autoPlay
                controls
                style={{
                  // width: aspectRatio === 'square' ? 540 : 540,
                  // height: aspectRatio === 'square' ? 960 : 960,
                  height: '600px',
                  width: '320px',
                  objectFit: 'contain',
                  aspectRatio: '9:16',
                }}
                loop
                ref={videoEl}
                key={reel_link?.original}
              >
                <source src={reel_link?.original} type="video/mp4" />
                Sorry, your browser doesn't support videos.
              </video>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start p-5 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="w-full" ref={intersectionRef}>
            <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              <h1
                className={classNames(
                  `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-2xl`,
                  {
                    'cursor-pointer transition-colors hover:text-accent':
                      isModal,
                  }
                )}
                // {...(isModal && {
                //   onClick: () => navigate(Routes.product(slug)),
                // })}
              >
                {name}
              </h1>
            </div>
            <div className="mt-2 flex items-center justify-between">
              {/* {unit && !hasVariations && (
                <span className="block text-sm font-normal text-body">
                  {unit}
                </span>
              )} */}
              {related_products?.length > 0 && (
                <div>
                  <RelatedProducts
                    products={related_products}
                    currentProductId="0"
                  />
                </div>
              )}
              {/* {isModal && (
                <div className="inline-flex shrink-0 items-center rounded border border-accent bg-accent px-3 py-1 text-sm text-white">
                  {ratings}
                  <StarIcon className="h-2.5 w-2.5 ltr:ml-1 rtl:mr-1" />
                </div>
              )} */}
            </div>

            {/* {description && (
              <div className="mt-3 text-sm leading-7 text-body md:mt-4">
                <Truncate
                  character={150}
                  {...(!isModal && {
                    onClick: () => scrollDetails(),
                    compressText: 'common:text-see-more',
                  })}
                >
                  {description}
                </Truncate>
              </div>
            )} */}

            <div className="mt-6 flex flex-col items-center md:mt-6 lg:flex-row">
              <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReelView;
