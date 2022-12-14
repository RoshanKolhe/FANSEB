import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import Card from '@/components/common/card';
import ValidationError from '@/components/ui/form-validation-error';
import { GalleryType, ProductType } from '@/types';
import { useTranslation } from 'next-i18next';
import SelectGalleryInput from '../ui/select-gallery-input';

const productGalleryType = [
  { name: 'Collection', value: GalleryType.Collection },
  { name: 'Product', value: GalleryType.Product },
];
interface SelectGalleryInputProps {
  checkGalleryType:any
}

const ProductGalleryTypeInput = ({checkGalleryType}:SelectGalleryInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  return (
    <Card className="w-full sm:w-8/12 md:w-2/3">
      <div className="mb-5">
        <Label>{t('form:form-title-product-gallary-type')}</Label>
        <SelectGalleryInput
          name="product_gallery_type"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={productGalleryType}
          onChange={checkGalleryType}
        />
        <ValidationError message={t(errors.product_gallery_type?.message)} />
      </div>
    </Card>
  );
};

export default ProductGalleryTypeInput;
