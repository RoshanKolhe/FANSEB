import InfluencerLayout from '@/components/layouts/influencer';
import ManufacturerCreateOrUpdateForm from '@/components/manufacturer/manufacturer-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminAndInfluencerOnly, adminOnly } from '@/utils/auth-utils';
import CreateOrUpdateReelsForm from '@/components/reels/reels-form';

export default function CreateReelsPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Create Reels
        </h1>
      </div>
      <CreateOrUpdateReelsForm />
    </>
  );
}
CreateReelsPage.authenticate = {
  permissions: adminAndInfluencerOnly,
};
CreateReelsPage.Layout = InfluencerLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
