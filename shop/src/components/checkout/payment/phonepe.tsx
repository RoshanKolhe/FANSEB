import { useTranslation } from 'next-i18next';

const PhonePe = () => {
  const { t } = useTranslation('common');
  return (
    <span className="block text-sm text-body">PHONEPE</span>
  );
};
export default PhonePe;
