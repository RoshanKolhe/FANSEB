import { EditIcon } from '@/components/icons/edit';
import dayjs from 'dayjs';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import Image from 'next/image';
import PopularProductList from '@/components/product/popular-product-list';
import { useTranslation } from 'next-i18next';
import { MapPin } from '@/components/icons/map-pin';
import { OrdersIcon, ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import { useAnalyticsQuery, usePopularProductsQuery } from '@/data/dashboard';
import { useRouter } from 'next/router';
import ReadMore from '@/components/ui/truncate';
import LinkButton from '../ui/link-button';
import { useMeQuery } from '@/data/user';
import { CheckMarkFill } from '../icons/checkmark-circle-fill';
import { CloseFillIcon } from '../icons/close-fill';
import { PhoneIcon } from '../icons/phone';
import { CubeIcon } from '../icons/shops/cube';
import { PriceWalletIcon } from '../icons/shops/price-wallet';
import { PercentageIcon } from '../icons/shops/percentage';
import { useInfluecnerProductsQuery } from '@/data/influencerProduct';

export default function InfluencerDashboard() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data }: any = useMeQuery();
  const { paginatorInfo } = useInfluecnerProductsQuery({
    userId: data?.id,
  });
  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({ limit: 10, language: locale });

  if (popularProductLoading) {
    return <Loader text={t('common:text-loading')} />;
  }

  if (popularProductError) {
    return <ErrorMessage message={popularProductError?.message} />;
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {!data?.is_active && (
          <div className="col-span-12 rounded-lg bg-red-500 px-5 py-4 text-sm text-light">
            {t('common:text-permission-message')}
          </div>
        )}
        {/* about Shop */}
        <div className="order-2 col-span-12 sm:col-span-6 xl:order-1 xl:col-span-4 3xl:col-span-3">
          <div className="flex flex-col items-center rounded bg-white py-8 px-6">
            <div className="relative mb-5 h-36 w-36 rounded-full">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-100">
                <Image
                  src={
                    data?.profile?.avatar?.original ?? '/avatar-placeholder.svg'
                  }
                  layout="fill"
                  objectFit="contain"
                  alt={data?.name}
                />
              </div>

              {data?.is_active ? (
                <div className="absolute bottom-4 h-5 w-5 overflow-hidden rounded-full bg-light end-2">
                  <CheckMarkFill width={20} className="text-accent me-2" />
                </div>
              ) : (
                <div className="absolute bottom-4 h-5 w-5 overflow-hidden rounded-full bg-light end-2">
                  <CloseFillIcon width={20} className="text-red-500 me-2" />
                </div>
              )}
            </div>

            <h1 className="mb-2 text-xl font-semibold text-heading">
              {data?.name}
            </h1>
            <p className="text-center text-sm text-body">
              <ReadMore character={70}>{data?.profile?.bio!}</ReadMore>
            </p>

            {/* <div className="mt-5 flex w-full justify-start">
            <span className="me-2 mt-0.5 text-muted-light">
              <MapPin width={16} />
            </span>

            <address className="text-sm not-italic text-body" style={{display:'flex',flexDirection:'column',width:'100%'}}>
              {!isEmpty(formatAddress(data?.address[0]!))
                ? formatAddress(data?.address!)
                : t('common:text-no-address')}
            </address>
          </div> */}

            <div className="mt-3 flex w-full justify-start">
              <span className="mt-0.5 text-muted-light me-2">
                <PhoneIcon width={16} />
              </span>
              <a
                href={`tel:${data?.profile?.contact}`}
                className="text-sm text-body"
              >
                {data?.profile?.contact
                  ? data?.profile?.contact
                  : t('common:text-no-contact')}
              </a>
            </div>

            <div className="mt-7 grid w-full grid-cols-1">
              <a
                href={`${
                  process.env.NEXT_PUBLIC_SHOP_URL
                }/${locale}/influencers/${data?.id}?${data?.name.replace(
                  / /g,
                  ''
                )}`}
                target="_blank"
                className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded !bg-gray-100 px-5 py-0 !font-normal leading-none !text-heading outline-none transition duration-300 ease-in-out hover:!bg-accent hover:!text-light focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700"
                rel="noreferrer"
              >
                Visit Page
              </a>
            </div>
          </div>
        </div>

        {/* Cover Photo */}

        <div className="relative order-1 col-span-12 h-full min-h-[400px] overflow-hidden rounded bg-light xl:order-2 xl:col-span-8 3xl:col-span-9">
          {data?.profile?.influencerPageImages &&
          data?.profile?.influencerPageImages.length > 0 ? (
            <Image
              src={
                data?.profile?.influencerPageImages[0]?.original ??
                '/product-placeholder-borderless.svg'
              }
              layout="fill"
              objectFit="contain"
              alt={data?.name}
            />
          ) : (
            <Image
              src="/product-placeholder-borderless.svg"
              layout="fill"
              objectFit="contain"
              alt={data?.name}
            />
          )}

          <LinkButton
            size="small"
            className="absolute top-3 bg-blue-500 shadow-sm hover:bg-blue-600 ltr:right-3 rtl:left-3"
            href={`/profile-update`}
          >
            <EditIcon className="w-4 me-2" /> Edit
          </LinkButton>
        </div>

        {/* Mini Dashboard */}
        <div className="order-4 col-span-12 xl:order-3 xl:col-span-9">
          <div className="grid h-full grid-cols-1 gap-5 rounded bg-light p-4 md:grid-cols-3">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-heading">
                {t('common:text-products')}
              </h2>

              <div className="border border-gray-100">
                <div className="flex items-center border-b border-gray-100 py-3 px-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FC9EC6] p-3 text-light">
                    <CubeIcon width={18} />
                  </div>

                  <div className="ms-3">
                    <p className="mb-0.5 text-lg font-semibold text-sub-heading">
                      {paginatorInfo?.total}
                    </p>
                    <p className="mt-0 text-sm text-muted">
                      {t('common:text-total-products')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6EBBFD] p-3 text-light">
                    <OrdersIcon width={16} />
                  </div>

                  <div className="ms-3">
                    <p className="mb-0.5 text-lg font-semibold text-sub-heading">
                      {data?.influencer_balance?.total_orders}
                    </p>
                    <p className="mt-0 text-sm text-muted">
                      {t('common:text-total-orders')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-heading">
                {t('common:text-revenue')}
              </h2>

              <div className="border border-gray-100">
                <div className="flex items-center border-b border-gray-100 py-3 px-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C7AF99] p-3 text-light">
                    <PriceWalletIcon width={16} />
                  </div>

                  <div className="ms-3">
                    <p className="mb-0.5 text-lg font-semibold text-sub-heading">
                      {data?.influencer_balance?.total_earnings}
                    </p>
                    <p className="mt-0 text-sm text-muted">
                      {t('common:text-gross-sales')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFA7AE] p-3 text-light">
                    <DollarIcon width={12} />
                  </div>

                  <div className="ms-3">
                    <p className="mb-0.5 text-lg font-semibold text-sub-heading">
                      {data?.influencer_balance?.current_balance}
                    </p>
                    <p className="mt-0 text-sm text-muted">
                      {t('common:text-current-balance')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-heading">
                {t('common:text-others')}
              </h2>

              <div className="border border-gray-100">
                <div className="flex items-center border-b border-gray-100 py-3 px-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D59066] p-3 text-light">
                    <PercentageIcon width={16} />
                  </div>

                  <div className="ms-3">
                    <p className="mb-0.5 text-lg font-semibold text-sub-heading">
                      {`${
                        data?.influencer_balance?.influencer_commission_rate ??
                        0
                      } %` ?? 'Not Set'}
                    </p>
                    <p className="mt-0 text-sm text-muted">Commission Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misc. Information */}
        <div className="order-3 col-span-12 rounded bg-light sm:col-span-6 xl:order-4 xl:col-span-3">
          <div className="flex flex-col border-b border-gray-200 p-6 2xl:p-7">
            <span className="mb-2 text-sm text-muted">
              {t('common:text-registered-since')}
            </span>
            <span className="text-sm font-semibold text-sub-heading">
              {dayjs(data?.created_at).format('MMMM D, YYYY')}
            </span>
          </div>

          <div className="flex flex-col p-6 2xl:p-7">
            <span className="mb-4 text-lg font-semibold text-sub-heading">
              {t('common:text-payment-info')}
            </span>

            <div className="flex flex-col space-y-3">
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-name')}:
                </span>{' '}
                <span className="font-semibold">
                  {data?.influencer_balance?.payment_info?.name}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-email')}:
                </span>{' '}
                <span className="font-semibold">
                  {data?.influencer_balance?.payment_info?.email}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-bank')}:
                </span>{' '}
                <span className="font-semibold">
                  {data?.influencer_balance?.payment_info?.bank}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="block w-full text-muted">
                  {t('common:text-account-no')}:
                </span>{' '}
                <span className="font-semibold">
                  {data?.influencer_balance?.payment_info?.account}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 mt-5 w-full xl:mb-0">
        <PopularProductList
          products={popularProductData}
          title={t('table:popular-products-table-title')}
        />
      </div>
    </>
  );
}
