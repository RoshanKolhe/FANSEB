import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InfluencerLayout from '@/components/layouts/influencer';
import { adminAndInfluencerOnly } from '@/utils/auth-utils';
import CreateOrUpdateInfluencerWithdrawForm from '@/components/influencer-withdraw/influencer-withdraw-form';

export default function CreateInfluencerWithdrawPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-gray-300 py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-withdraw')}
        </h1>
      </div>
      <CreateOrUpdateInfluencerWithdrawForm />
    </>
  );
}
CreateInfluencerWithdrawPage.authenticate = {
  permissions: adminAndInfluencerOnly,
};
CreateInfluencerWithdrawPage.Layout = InfluencerLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
