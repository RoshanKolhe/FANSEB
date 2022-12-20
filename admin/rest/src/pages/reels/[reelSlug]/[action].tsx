import InfluencerLayout from '@/components/layouts/influencer';
import anufacturerCreateOrUpdateForm from '@/components/manufacturer/manufacturer-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminAndInfluencerOnly, adminOnly } from '@/utils/auth-utils';
import { useManufacturerQuery } from '@/data/manufacturer';
import { Config } from '@/config';
import CreateOrUpdateReelsForm from '@/components/reels/reels-form';
import { useReelQuery } from '@/data/reels';

export default function UpdateReelPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { reel, loading, error } = useReelQuery({
    slug: query.reelSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Update Reel
        </h1>
      </div>
      <CreateOrUpdateReelsForm initialValues={reel} />
    </>
  );
}
UpdateReelPage.authenticate = {
  permissions: adminAndInfluencerOnly,
};
UpdateReelPage.Layout = InfluencerLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
