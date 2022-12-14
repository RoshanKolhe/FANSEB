import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import CreateOrUpdateInfluencerProduct from '@/components/product/influencer-product-form';
import InfluencerLayout from '@/components/layouts/influencer';

export default function CreateCategoriesPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:input-label-products')}
        </h1>
      </div>
      <CreateOrUpdateInfluencerProduct />
    </>
  );
}

CreateCategoriesPage.Layout = InfluencerLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
